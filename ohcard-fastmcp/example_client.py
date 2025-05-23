#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
示例客户端脚本，演示如何使用OH卡MCP服务器
"""

import asyncio
from fastmcp import FastMCPClient

async def main():
    """主函数，演示OH卡MCP客户端的使用"""
    # 创建MCP客户端
    client = FastMCPClient()
    
    # 连接到OH卡服务器（确保服务器已启动）
    print("🔮 连接到OH卡服务器...")
    
    try:
        # 获取OH卡介绍
        print("\n==== OH卡介绍 ====")
        info = await client.invoke("ohcard-helper", "what_is_oh_cards")
        print(f"\n📖 {info['title']}")
        print(f"{info['description']}")
        print("\n✨ 特点:")
        for feature in info['features']:
            print(f"  {feature}")
        
        # 获取OH卡使用流程
        print("\n==== OH卡使用流程 ====")
        process = await client.invoke("ohcard-helper", "get_oh_card_process")
        print(f"\n🚀 {process['title']}")
        print(f"{process['subtitle']}")
        
        print("\n📋 步骤:")
        for step in process['steps']:
            print(f"  {step['step']}. {step['name']} - {step['description']}")
        
        # 抽取一张OH卡
        print("\n==== 抽取OH卡 ====")
        intention = input("\n🤔 请输入你想探索的问题或意图 (可直接回车跳过): ")
        card = await client.invoke("ohcard-helper", "draw_oh_card", {"intention": intention})
        
        print(f"\n🎴 你抽到了第 {card['card_id']} 号卡片!")
        print(f"图片链接: {card['image_url']}")
        print(f"\n💫 {card['guidance']}")
        
        # 获取引导问题
        print("\n==== 引导问题 ====")
        print("引导问题类型:")
        types = await client.invoke("ohcard-helper", "get_all_question_types")
        
        for i, type_info in enumerate(types['types']):
            print(f"  {i+1}. {type_info['type']} - {type_info['description']}")
        
        print("\n选择一个引导问题类型:")
        print("  1. 观察感受")
        print("  2. 深入探索")
        print("  3. 情境代入")
        print("  4. 内心连接")
        print("  5. 启发行动")
        print("  0. 随机选择")
        
        choice = input("\n请选择 (0-5): ")
        question_type = "random"
        
        if choice == "1":
            question_type = "观察感受"
        elif choice == "2":
            question_type = "深入探索"
        elif choice == "3":
            question_type = "情境代入"
        elif choice == "4":
            question_type = "内心连接"
        elif choice == "5":
            question_type = "启发行动"
        
        questions = await client.invoke("ohcard-helper", "get_guidance_questions", {"question_type": question_type})
        
        print(f"\n📝 {questions['question_type']} 类型的引导问题:")
        for q in questions['questions']:
            print(f"  ❓ {q}")
        
        print(f"\n💡 提示: {questions['usage_tip']}")
        
        # 结束会话
        print("\n==== 会话结束 ====")
        print("感谢使用OH卡探索工具！希望这次体验能给你带来新的洞察和启发。")
        print("你可以随时重新启动此示例客户端进行新的探索。")
        
    except Exception as e:
        print(f"\n❌ 发生错误: {e}")
        print("请确保OH卡服务器已启动，可通过运行 'python ohcard.py' 启动服务器。")

if __name__ == "__main__":
    asyncio.run(main()) 