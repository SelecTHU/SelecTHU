// frontend/selecthu/app/llm/components/prompt/PromptTemplates.tsx

import {
    Box,
    Text,
    VStack,
    Button,
    useColorModeValue,
    SimpleGrid,
} from "@chakra-ui/react";

interface PromptTemplate {
    id: string;
    title: string;
    content: string;
    category: string;
}

interface PromptTemplatesProps {
    onSelectTemplate: (content: string) => void;  // 修改这个函数的行为
    setInputValue: (value: string) => void;       // 新增这个属性用于设置输入框的值
}

export default function PromptTemplates({ onSelectTemplate, setInputValue }: PromptTemplatesProps) {
    const bgColor = useColorModeValue("white", "gray.800");

    const templates: PromptTemplate[] = [
        {
            id: "1",
            title: "课程推荐",
            content: "请根据我的专业背景，推荐适合我的课程。",
            category: "recommendation"
        },
        {
            id: "2",
            title: "课程详情",
            content: "请介绍这门课程的具体内容和特点。",
            category: "inquiry"
        },
        {
            id: "3",
            title: "选课建议",
            content: "我想了解这些课程的选课策略。",
            category: "strategy"
        },
        {
            id: "4",
            title: "课程组合",
            content: "请推荐适合一起选择的课程组合。",
            category: "combination"
        },
    ];

    const handleTemplateClick = (content: string) => {
        setInputValue(content);  // 将内容设置到输入框
    };

    return (
        <Box
            bg={bgColor}
            p={4}
            borderRadius="lg"
            shadow="sm"
            h="full"
            w="full"
            display="flex"
            flexDirection="column"
        >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                常用提示词
            </Text>
            <Box overflowY="auto" flex="1">
                <SimpleGrid columns={2} spacing={3}>
                    {templates.map((template) => (
                        <Button
                            key={template.id}
                            size="sm"
                            colorScheme="blue"  // 改为默认蓝色
                            variant="solid"     // 使用实心按钮样式
                            onClick={() => handleTemplateClick(template.content)}
                            height="auto"
                            whiteSpace="normal"
                            py={2}
                        >
                            {template.title}
                        </Button>
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
}