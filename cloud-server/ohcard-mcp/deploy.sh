#!/bin/bash

# OH卡MCP服务器 - 宝塔面板一键部署脚本
# 使用方法: bash deploy.sh [命令]
# 命令: build, deploy, stop, restart, logs, status, test

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查Docker环境
check_docker() {
    log_info "检查Docker环境..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请在宝塔面板软件商店安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose未安装，请安装docker-compose"
        exit 1
    fi
    
    log_success "Docker环境检查通过"
}

# 构建镜像
build_image() {
    log_info "构建OH卡MCP服务镜像..."
    docker-compose build --no-cache
    log_success "镜像构建完成"
}

# 部署服务
deploy_service() {
    log_info "部署OH卡MCP服务..."
    
    # 创建日志目录
    mkdir -p ./logs
    
    # 停止现有服务
    docker-compose down 2>/dev/null || true
    
    # 启动服务
    docker-compose up -d --build
    
    log_success "服务部署完成"
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    check_health
}

# 停止服务
stop_service() {
    log_info "停止OH卡MCP服务..."
    docker-compose down
    log_success "服务已停止"
}

# 重启服务
restart_service() {
    log_info "重启OH卡MCP服务..."
    docker-compose restart ohcard-mcp
    log_success "服务已重启"
    
    # 等待重启完成
    sleep 5
    check_health
}

# 查看日志
show_logs() {
    log_info "显示服务日志（按Ctrl+C退出）..."
    docker-compose logs -f ohcard-mcp
}

# 查看状态
show_status() {
    log_info "查看服务状态..."
    
    echo "📊 容器状态:"
    docker-compose ps
    
    echo -e "\n💾 资源使用:"
    docker stats --no-stream ohcard-mcp-server 2>/dev/null || echo "容器未运行"
    
    echo -e "\n🌐 端口状态:"
    netstat -tulpn | grep 9593 || echo "端口9593未监听"
}

# 健康检查
check_health() {
    log_info "执行健康检查..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:9593/health > /dev/null; then
            log_success "健康检查通过！服务正常运行"
            echo -e "\n🔗 服务地址:"
            echo "   - 健康检查: http://localhost:9593/health"
            echo "   - 工具列表: http://localhost:9593/tools"
            echo "   - API文档: 查看 BAOTA_DEPLOYMENT.md"
            return 0
        fi
        
        echo "尝试 $attempt/$max_attempts..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "健康检查失败！请查看日志: docker-compose logs ohcard-mcp"
    return 1
}

# 运行测试
run_test() {
    log_info "运行功能测试..."
    
    if [ ! -f "test_all_endpoints.js" ]; then
        log_error "测试文件不存在"
        return 1
    fi
    
    # 检查服务是否运行
    if ! curl -f -s http://localhost:9593/health > /dev/null; then
        log_error "服务未运行，请先部署服务: bash deploy.sh deploy"
        return 1
    fi
    
    node test_all_endpoints.js
}

# 性能测试
run_performance_test() {
    log_info "运行性能测试..."
    
    if [ ! -f "test_performance.js" ]; then
        log_error "性能测试文件不存在"
        return 1
    fi
    
    # 检查服务是否运行
    if ! curl -f -s http://localhost:9593/health > /dev/null; then
        log_error "服务未运行，请先部署服务: bash deploy.sh deploy"
        return 1
    fi
    
    TEST_URL=http://localhost:9593 node test_performance.js
}

# 显示帮助
show_help() {
    echo "OH卡MCP服务器 - 宝塔面板部署脚本"
    echo ""
    echo "使用方法:"
    echo "  bash deploy.sh [命令]"
    echo ""
    echo "可用命令:"
    echo "  build       - 构建Docker镜像"
    echo "  deploy      - 部署服务（构建+启动）"
    echo "  stop        - 停止服务"
    echo "  restart     - 重启服务"
    echo "  logs        - 查看实时日志"
    echo "  status      - 查看服务状态"
    echo "  test        - 运行功能测试"
    echo "  perf        - 运行性能测试"
    echo "  health      - 健康检查"
    echo "  help        - 显示此帮助"
    echo ""
    echo "示例:"
    echo "  bash deploy.sh deploy   # 一键部署"
    echo "  bash deploy.sh logs     # 查看日志"
    echo "  bash deploy.sh test     # 运行测试"
}

# 主函数
main() {
    case "${1:-help}" in
        "build")
            check_docker
            build_image
            ;;
        "deploy")
            check_docker
            deploy_service
            ;;
        "stop")
            stop_service
            ;;
        "restart")
            restart_service
            ;;
        "logs")
            show_logs
            ;;
        "status")
            show_status
            ;;
        "test")
            run_test
            ;;
        "perf")
            run_performance_test
            ;;
        "health")
            check_health
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@" 