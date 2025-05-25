# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖（包括开发依赖）
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY src/ ./src/

# 运行阶段
FROM node:18-alpine AS runtime

# 安装dumb-init用于信号处理
RUN apk add --no-cache dumb-init

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ohcard -u 1001

# 设置工作目录
WORKDIR /app

# 从构建阶段复制文件
COPY --from=builder --chown=ohcard:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=ohcard:nodejs /app/src ./src
COPY --chown=ohcard:nodejs package*.json ./

# 切换到非root用户
USER ohcard

# 暴露端口
EXPOSE 9593

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const req=http.request({hostname:'localhost',port:9593,path:'/health',method:'GET'},res=>{process.exit(res.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.end();"

# 使用dumb-init启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"] 