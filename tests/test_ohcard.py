#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
OH卡探索工具测试
"""

import unittest
import asyncio
import sys
import os

# 添加父目录到路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 导入要测试的模块
# 注意：这里我们不直接导入ohcard模块，因为它会启动服务器
# 而是导入其中的数据结构进行测试
from ohcard import OH_CARDS, GUIDANCE_QUESTIONS

class TestOHCard(unittest.TestCase):
    """OH卡功能测试类"""
    
    def test_oh_cards_structure(self):
        """测试OH卡数据结构"""
        # 确保OH_CARDS是字典类型
        self.assertIsInstance(OH_CARDS, dict)
        
        # 确保至少有一张卡牌
        self.assertGreater(len(OH_CARDS), 0)
        
        # 检查第一张卡牌的结构
        first_card_id = list(OH_CARDS.keys())[0]
        first_card = OH_CARDS[first_card_id]
        
        # 确保卡牌有image_url字段
        self.assertIn('image_url', first_card)
        
        # 确保image_url是字符串
        self.assertIsInstance(first_card['image_url'], str)
        
        # 确保image_url不为空
        self.assertGreater(len(first_card['image_url']), 0)
    
    def test_guidance_questions_structure(self):
        """测试引导问题数据结构"""
        # 确保GUIDANCE_QUESTIONS是字典类型
        self.assertIsInstance(GUIDANCE_QUESTIONS, dict)
        
        # 确保至少有一种问题类型
        self.assertGreater(len(GUIDANCE_QUESTIONS), 0)
        
        # 检查第一种问题类型的结构
        first_type = list(GUIDANCE_QUESTIONS.keys())[0]
        questions = GUIDANCE_QUESTIONS[first_type]
        
        # 确保问题列表是列表类型
        self.assertIsInstance(questions, list)
        
        # 确保至少有一个问题
        self.assertGreater(len(questions), 0)
        
        # 确保第一个问题是字符串
        self.assertIsInstance(questions[0], str)
        
        # 确保第一个问题不为空
        self.assertGreater(len(questions[0]), 0)
    
    def test_required_question_types(self):
        """测试是否包含所有必要的问题类型"""
        required_types = ["观察感受", "深入探索", "情境代入", "内心连接", "启发行动"]
        
        for qtype in required_types:
            self.assertIn(qtype, GUIDANCE_QUESTIONS)
            # 确保每种类型至少有一个问题
            self.assertGreater(len(GUIDANCE_QUESTIONS[qtype]), 0)

if __name__ == '__main__':
    unittest.main() 