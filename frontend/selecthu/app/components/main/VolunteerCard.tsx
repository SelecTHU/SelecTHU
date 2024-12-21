// components/main/VolunteerCard.tsx

import React, { useRef, useEffect } from 'react';
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './constants';
import { Volunteer, VolunteerWithCount } from '@/app/types/volunteer';


interface VolunteerCardProps {
  height: string;
  onVolunteerDrag: (volunteer: Volunteer) => void;
  availableVolunteers: VolunteerWithCount[];
  onVolunteerReturn: (volunteer: Volunteer) => void;
  onVolunteerRemove: (courseId: string, volunteerId: string) => void;
}



export default function VolunteerCard({
  height,
  onVolunteerDrag,
  availableVolunteers,
  onVolunteerReturn,
}: VolunteerCardProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const volunteerBgColors = {
    required: useColorModeValue('red.100', 'red.700'),
    limited: useColorModeValue('blue.100', 'blue.700'),
    optional: useColorModeValue('green.100', 'green.700'),
    sports: useColorModeValue('purple.100', 'purple.700'),
  };

  // 处理志愿放置
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.VOLUNTEER,
    drop: (item: Volunteer) => {
      onVolunteerReturn(item);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  }));

// components/main/VolunteerCard.tsx

const VolunteerBox = ({ volunteer }: { volunteer: VolunteerWithCount }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.VOLUNTEER,
    item: volunteer,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (boxRef.current) {
      drag(boxRef.current);
    }
  }, [drag]);

  // 获取志愿类型的中文名称
  const getTypeText = (type: string) => {
    switch(type) {
      case 'required': return '必修';
      case 'limited': return '限选';
      case 'optional': return '任选';
      case 'sports': return '体育';
      default: return '';
    }
  };

  return (
    <Box
      ref={boxRef}
      bg={volunteerBgColors[volunteer.type]}
      p={2}
      borderRadius="md"
      cursor="move"
      opacity={isDragging ? 0.5 : 1}
      _hover={{ shadow: 'md' }}
      width="100%"
    >
      <Flex justify="space-between" align="center">
        <Text fontSize="sm">
          {`${getTypeText(volunteer.type)}${volunteer.priority}`}
        </Text>
        <Text fontSize="xs" color="gray.600">
          {volunteer.priority === 3 ? '∞' : `×${volunteer.remaining}`}
        </Text>
      </Flex>
    </Box>
  );
};

  const renderVolunteerSection = (type: Volunteer['type']) => {
    const typeVolunteers = availableVolunteers.filter(v => v.type === type);
    
    return (
      <Box mb={4}>
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          {type === 'required' ? '必修' :
           type === 'limited' ? '限选' :
           type === 'optional' ? '任选' : '体育'}
        </Text>
        <Stack spacing={2}>
          {[1, 2, 3].map(priority => (
            <Flex key={priority} wrap="wrap" gap={1}>
              {typeVolunteers
                .filter(v => v.priority === priority)
                .map(volunteer => (
                  <VolunteerBox key={volunteer.id} volunteer={volunteer} />
                ))}
            </Flex>
          ))}
        </Stack>
      </Box>
    );
  };

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      drop(cardRef.current);
    }
  }, [drop]);

  return (
    <Box
      ref={cardRef}
      bg={bgColor}
      rounded="md"
      p={4}
      shadow="sm"
      height={height}
      overflow="auto"
      opacity={isOver ? 0.8 : 1}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        志愿分配
      </Text>
      {/* 使用水平Flex布局排列四种类型 */}
      <Flex justify="space-between" gap={2}>
        {['required', 'limited', 'optional', 'sports'].map((type) => (
          <Stack key={type} spacing={2} flex="1" minW="50px">
            {/* 垂直排列1、2、3志愿 */}
            {[1, 2, 3].map(priority => (
              <Stack key={priority} spacing={1}>
                {availableVolunteers
                  .filter(v => v.type === type && v.priority === priority)
                  .map(volunteer => (
                    <VolunteerBox key={volunteer.id} volunteer={volunteer} />
                  ))}
              </Stack>
            ))}
          </Stack>
        ))}
      </Flex>
    </Box>
  );
}