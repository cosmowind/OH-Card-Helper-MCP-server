#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
OH卡探索工具启动脚本
"""

import os
import sys
import subprocess

def main():
    """启动OH卡服务器"""
    print("🚀 启动OH卡探索工具服务器...")
    
    # 获取ohcard.py的绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ohcard_path = os.path.join(script_dir, "ohcard.py")
    
    # 检查文件是否存在
    if not os.path.exists(ohcard_path):
        print(f"❌ 错误: 找不到文件 {ohcard_path}")
        sys.exit(1)
    
    try:
        # 运行ohcard.py
        print(f"📡 正在启动服务器: {ohcard_path}")
        subprocess.run([sys.executable, ohcard_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ 启动服务器时出错: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    
if __name__ == "__main__":
    main() 