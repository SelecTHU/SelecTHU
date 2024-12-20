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
import { Volunteer } from '@/app/types/volunteer';

interface VolunteerCardProps {
  height: string;
  onVolunteerDrag: (volunteer: Volunteer) => void;
  availableVolunteers: Volunteer[];
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

  const VolunteerBox = ({ volunteer }: { volunteer: Volunteer }) => {
    const boxRef = useRef<HTMLDivElement>(null);
    
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.VOLUNTEER,
      item: volunteer,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
          onVolunteerDrag(volunteer);
        }
      },
    }));

    // 使用 useEffect 来处理 ref
    useEffect(() => {
      if (boxRef.current) {
        drag(boxRef.current);
      }
    }, [drag]);

    return (
      <Box
        ref={boxRef}
        bg={volunteerBgColors[volunteer.type]}
        p={1}
        borderRadius="sm"
        cursor="move"
        opacity={isDragging ? 0.5 : 1}
        position="relative"
        mb={1}
        _hover={{ shadow: 'md' }}
      >
        <Text fontSize="xs">
          {volunteer.type === 'required' ? '必修' :
           volunteer.type === 'limited' ? '限选' :
           volunteer.type === 'optional' ? '任选' : '体育'}
          {volunteer.priority}志愿
        </Text>
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
      {renderVolunteerSection('required')}
      {renderVolunteerSection('limited')}
      {renderVolunteerSection('optional')}
      {renderVolunteerSection('sports')}
    </Box>
  );
}