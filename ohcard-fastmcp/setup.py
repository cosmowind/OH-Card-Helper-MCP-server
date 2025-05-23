#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="oh-cards-explorer",
    version="0.1.0",
    author="OH Cards Explorer Team",
    author_email="your-email@example.com",
    description="OH卡探索工具 - 通过图像投射进行自我探索和内心洞察",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/oh-cards-explorer",
    packages=find_packages(),
    py_modules=["ohcard"],
    install_requires=[
        "fastmcp>=2.4.0",
        # asyncio和logging是Python内置模块，不需要单独安装
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
    entry_points={
        "console_scripts": [
            "ohcard-server=run:main",
        ],
    },
) 