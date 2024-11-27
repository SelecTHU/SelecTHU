// app/components/search/CommentSection.tsx
import React from 'react';
import { useColorModeValue } from '@chakra-ui/react';

const CommentSection = () => {
  const bg = useColorModeValue('white', 'gray.800');
  return <div style={{ backgroundColor: bg }}>评论区内容</div>;
};

export default CommentSection;