// app/components/search/SelectedFilters.tsx
"use client";

import {
  Box,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Filter } from "./FilterSection";

import { searchCourses } from "@/app/search/actions"

interface SelectedFiltersProps {
  selectedFilters: Filter[];
  removeFilter: (type: string) => void;
  searchCoursesAction: (filters: Filter[]) => Promise<any>;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ selectedFilters, removeFilter, searchCoursesAction }) => {
  // Call hooks at the top level
  const containerBg = useColorModeValue("white", "gray.800");
  const filterBg = useColorModeValue("gray.100", "gray.700");

  // Function to get filter labels
  const getFilterLabel = (type: string): string => {
    switch (type) {
      case "courseName":
        return "课程名称";
      case "department":
        return "开课院系";
      case "courseAttribute":
        return "课程属性";
      case "classTime":
        return "开课时间";
      case "instructor":
        return "授课教师";
      default:
        return type;
    }
  };

  return (
    <Box
      bg={containerBg}
      p={4}
      borderRadius="md"
      boxShadow="md"
      mb={4}
    >
      <Stack direction="row" spacing={4} wrap="wrap">
        {selectedFilters.map((filter) => (
          <Box
            key={filter.type}
            bg={filterBg} // Use the variable instead of calling the hook here
            p={3}
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <Text fontSize="sm" mr={2}>
              {getFilterLabel(filter.type)}：{filter.value}
            </Text>
            <IconButton
              size="sm"
              icon={<CloseIcon />}
              aria-label={`删除${getFilterLabel(filter.type)}`}
              onClick={async () => {
                  removeFilter(filter.type)
                  await searchCoursesAction(selectedFilters.filter((f) => f.type !== filter.type))
              }}
              variant="ghost"
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SelectedFilters;
