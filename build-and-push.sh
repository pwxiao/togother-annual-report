#!/bin/bash

# 构建并推送 Docker 镜像脚本
# 使用方法: ./build-and-push.sh [tag]
# 例如: ./build-and-push.sh v1.0.0
# 环境变量: VITE_API_URL (必需)

set -e

# 配置变量
IMAGE_NAME="${IMAGE_NAME:-togother-annual-report}"
REGISTRY="${DOCKER_REGISTRY:-registry.cn-hangzhou.aliyuncs.com}"
NAMESPACE="${DOCKER_NAMESPACE:-pwxiao}"
TAG="${1:-latest}"
VITE_API_URL="${VITE_API_URL:-https://xxx}"

# 检查必需的环境变量
if [ -z "${VITE_API_URL}" ]; then
  echo "❌ 错误: VITE_API_URL 环境变量未设置"
  echo "   请设置 API 地址，例如:"
  echo "   export VITE_API_URL=https://api.example.com"
  echo "   或: VITE_API_URL=https://api.example.com ./build-and-push.sh"
  exit 1
fi

# 完整镜像名称
FULL_IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"
LATEST_IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:latest"

echo "🚀 开始构建镜像: ${FULL_IMAGE_NAME}"
echo "   API URL: ${VITE_API_URL}"

# 构建镜像，传入构建参数
docker build \
  --build-arg VITE_API_URL="${VITE_API_URL}" \
  --platform linux/amd64 \
  -t "${FULL_IMAGE_NAME}" \
  .

# 如果指定了标签且不是 latest，同时打 latest 标签
if [ "${TAG}" != "latest" ]; then
  echo "📌 同时打 latest 标签"
  docker tag "${FULL_IMAGE_NAME}" "${LATEST_IMAGE_NAME}"
fi

echo "📤 推送镜像到仓库..."

# 推送指定标签
docker push "${FULL_IMAGE_NAME}"

# 如果指定了标签且不是 latest，同时推送 latest
if [ "${TAG}" != "latest" ]; then
  docker push "${LATEST_IMAGE_NAME}"
fi

echo "✅ 构建和推送完成!"
echo "   镜像地址: ${FULL_IMAGE_NAME}"
if [ "${TAG}" != "latest" ]; then
  echo "   Latest: ${LATEST_IMAGE_NAME}"
fi

