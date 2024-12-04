# 阶段构建：
# 阶段1：构建nvidia/cuda
# 基础镜像，使用支持 CUDA 的镜像
FROM nvidia/cuda:12.6.2-cudnn8-runtime-ubuntu22.04
LABEL maintainer=RWKV-RAG-Personal
# 阶段2：运行阶段，python3.10
FROM python:3.10

# 设置工作目录
WORKDIR /app
# copy
COPY . .
COPY whl/torch-2.2.2+cu121-cp310-cp310-linux_x86_64.whl /app/whl/
# 安装 依赖
# 创建 sources.list 文件
RUN echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free" > /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian-security/ bullseye-security main contrib non-free" >> /etc/apt/sources.list
RUN apt-get update
# 更新并安装 CUDA 工具包，包括 nvcc
RUN apt-get update && apt-get install -y \
    libcublas-12-1 \
    cuda-toolkit-12-1 \
    --allow-change-held-packages

# 设置 CUDA_HOME 环境变量
ENV CUDA_HOME=/usr/local/cuda


# [torch安装方法 1]从.whl文件构建
RUN pip install  /app/whl/torch-2.2.2+cu121-cp310-cp310-linux_x86_64.whl

RUN apt-get update --fix-missing
# [torch安装方法 2]联网下载 pypi - 耗时操作，建议提前下载好torch的whl，直接安装到镜像容器内
# RUN pip3 install torch==2.2.2  --index-url https://download.pytorch.org/whl/cu121
RUN pip install -r requirements.txt --no-cache-dir

# 安装 Playwright 及其浏览器依赖
RUN pip install playwright && \
    playwright install && \
    playwright install-deps

# 安装其他库
RUN apt-get install -y --fix-missing \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libasound2
    
# 安装 Tesseract OCR 及其依赖
RUN apt-get install -y --fix-missing \
    tesseract-ocr \
    tesseract-ocr-chi-sim
    
# 暴露服务端口
EXPOSE 8501

# 设置环境变量，启用 GPU0， 可根据实际情况修改
# ENV CUDA_VISIBLE_DEVICES 0

RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# 启动服务
ENTRYPOINT ["streamlit", "run", "client.py"]