from zhipuai import ZhipuAI
from zhipuai.types.assistant.assistant_create_params import (
    ConversationMessage,
    MessageContent,
)

import os
import re
import json

def chat(messages: list[dict], stream: bool = False) -> dict:
    """
    调用大模型回答问题

    :param context: 上下文
    :param stream: 是否使用流式，默认为False
    """
    if (
        isinstance(messages, list) is False
        or len(messages) == 0
        or isinstance(stream, bool) is False
    ):
        return {"status": 400, "message": "argument error"}

    client = ZhipuAI(api_key=os.getenv("CHAT_API_KEY"))

    try:
        completion = client.chat.completions.create(
            model=os.getenv("CHAT_MODEL"),
            messages=messages,
            temperature=0.3,
            max_tokens=8192,
            stream=stream,
        )

        if stream:
            return {"status": 200, "resp": completion}
        else:
            return {"status": 200, "resp": completion.choices[0].message.content}
    except Exception as e:
        return {"status": 500, "msg": str(e)}


def new_chat(question: str, conversation_id: str = None, stream: bool = True):
    if (
        (conversation_id is not None and isinstance(conversation_id, str) is False)
        or isinstance(question, str) is False
        or isinstance(stream, bool) is False
    ):
        return {"status": 400, "message": "argument error"}

    import httpx

    headers = httpx.Headers({"Authorization": f"Bearer {os.getenv('CHAT_API_KEY')}"})
    base_url = "https://open.bigmodel.cn/api/llm-application/open"
    client = httpx.Client(base_url=base_url, headers=headers)

    variables_url = f"/v2/application/{os.getenv("APP_ID")}/variables"
    new_conversation_url = f"/v2/application/{os.getenv("APP_ID")}/conversation"
    request_url = "/v2/application/generate_request_id"
    try:
        resp = client.get(variables_url)
        code = resp.json()["code"]
        if code != 200:
            raise Exception(resp.json()["message"])
        variables_list = resp.json()["data"]
        variables_list[0]["value"] = question
        
        # 如果没有会话ID，则新建会话
        if conversation_id is None:
            resp = client.post(
                new_conversation_url,
            )
            code = resp.json()["code"]
            if code == 200:
                conversation_id = resp.json()["data"]["conversation_id"]
            else:
                raise Exception(resp.json()["message"])

        # 获取request_id
        data = {
            "app_id": os.getenv("APP_ID"),
            "conversation_id": conversation_id,
            "key_value_pairs": variables_list,
        }
        resp = client.post(request_url, json=data)
        code = resp.json()["code"]
        if code != 200:
            raise Exception(resp.json()["message"])
        request_id = resp.json()["data"]["id"]
        
        # 获取回复（EventStream）
        resp_url = f"/v2/model-api/{request_id}/sse-invoke"
        extra_headers = httpx.Headers({"accept": "text/event-stream"})
        client.headers.update(extra_headers)

        resp = client.post(resp_url)

        return {"status": 200, "resp": resp}
    except Exception as e:
        return {"status": 500, "msg": str(e)}


def run(question: str):
    try:
        if isinstance(question, str) is False:
            raise Exception("argument error")
    
        resp = new_chat(question)

        if resp["status"] != 200:
            raise Exception(resp["msg"])
        
        # 处理EventStream
        stream = resp["resp"]
        events = stream.text.split("\n\n")
        response = ""
        for event in events:
            if event:
                data_regex = re.compile(r"data: ?(.+)")
                data = data_regex.search(event)
                if data is None:
                    continue
                data = json.loads(data.group(1))
                if "msg" in data.keys():
                    response += data["msg"]
        
        return {"status": 200, "response": response}
    except Exception as e:
        return {"status": 500, "msg": str(e)}
    
        
if __name__ == "__main__":
    # 测试
    from dotenv import load_dotenv

    os.chdir(os.path.dirname(__file__))
    load_dotenv("../.env")

    # 输出加载的相关环境变量
    print(f"Chat api key: {os.getenv('CHAT_API_KEY')}")
    print(f"Chat model: {os.getenv('CHAT_MODEL')}")

    messages = [
        {
            "role": "system",
            "content": "你是清选助手，你了解清华大学当前的开课信息，并擅长根据用户需求提供信息、\
                解答问题、推荐课程等。你的任务是帮助用户更好地达成选课需求。",
        },
        {"role": "user", "content": "你是谁"},
    ]

    # 测试非流式
    def test_normal(messages):
        print("--- test_normal ---")
        resp = chat(messages)
        print(resp["resp"], end="\n\r\n\r")

    def test_stream(messages):
        print("--- test_stream ---")
        resp = chat(messages, stream=True)
        for i in resp["resp"]:
            print(i.choices[0].delta.content, end="")

        print("\n\r")

    # test_normal(messages)
    # test_stream(messages)
    # 然而 ，这种调用方式无法加载知识库，所以仅作为占位，测试用

    # 测试新会话
    def test_new_chat(question):
        print("--- test_new_chat ---")
        resp = new_chat(question)
        print(f"status: {resp['status']}")
        if resp["status"] == 200:
            # 处理EventStream
            stream = resp["resp"]
            # 按照event分割
            events = stream.text.split("\n\n")
            for event in events:
                if event:
                    import re
                    import json
                    data_regex = re.compile(r"data: ?(.+)")
                    data = data_regex.search(event)
                    if data is None:
                        continue
                    data = json.loads(data.group(1))
                    if "msg" in data.keys():
                        print(data["msg"], end="")
                
        else:
            print(resp["msg"])
        print("\n\r")

    print(run("面向对象"))
