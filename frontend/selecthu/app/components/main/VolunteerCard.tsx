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
    required: useColorModeValue('red.100', 'red.700'),  // 红色系
    limited: useColorModeValue('yellow.100', 'yellow.700'),  // 黄色系
    optional: useColorModeValue('green.100', 'green.700'),  // 绿色系  
    sports: useColorModeValue('blue.100', 'blue.700'), // 蓝色系
  };

    // 在 VolunteerCard 组件中添加
  useEffect(() => {
    console.log('Available volunteers updated:', availableVolunteers);
  }, [availableVolunteers]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.VOLUNTEER,
    drop: (item: Volunteer) => {
      onVolunteerReturn(item);
      return item;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const VolunteerBox = ({ volunteer }: { volunteer: VolunteerWithCount }) => {
    const boxRef = useRef<HTMLDivElement>(null);
    
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.VOLUNTEER,
      item: () => ({ ...volunteer }), // 创建新的对象，避免修改原对象
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        // 只有在成功放置并返回结果时才触发志愿减少
        if (item && dropResult) {
          onVolunteerDrag({
            id: volunteer.id,
            type: volunteer.type,
            priority: volunteer.priority,
          });
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }), [volunteer]); // 添加依赖项

    useEffect(() => {
      if (boxRef.current) {
        drag(boxRef.current);
      }
    }, [drag]);

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
        cursor="grab"
        opacity={isDragging ? 0.5 : 1}
        _hover={{ shadow: 'md' }}
        _active={{ cursor: 'grabbing' }}
        width="100%"
        mb={1}
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="sm">
            {`${getTypeText(volunteer.type)}${volunteer.priority}志愿`}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {volunteer.priority === 3 ? '∞' : `×${volunteer.remaining}`}
          </Text>
        </Flex>
      </Box>
    );
  };

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      drop(cardRef.current);
    }
  }, [drop]);

  const volunteerTypes = ['required', 'limited', 'optional', 'sports'] as const;

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
      <Flex gap={2}>
        {volunteerTypes.map((type) => (
          <Box key={type} flex="1" minW="0">
            <Stack spacing={1}>
              {availableVolunteers
                .filter(v => v.type === type && v.remaining > 0)  // 只显示 remaining > 0 的志愿
                .sort((a, b) => a.priority - b.priority)  // 按优先级排序
                .map(volunteer => (
                  <VolunteerBox key={volunteer.id} volunteer={volunteer} />
                ))
              }
            </Stack>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}