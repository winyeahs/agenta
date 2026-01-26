#!/bin/sh
# 先执行构建命令，在前台执行并输出到日志
pnpm build >> ./web.log 2>&1

# 构建成功后再执行启动命令
nohup pnpm start >> ./web.log 2>&1 &

# 保持容器运行
nohup tail -f /dev/null
