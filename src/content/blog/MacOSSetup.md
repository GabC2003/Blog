---
title: MacOS 装机配置
date: 2026-05-17
keywords: ["macOS", "命令行", "zsh", "开发环境"]
summary: "新 Mac 装机全记录：命令行工具、zsh 插件、Python 生态一条龙"
---

# 命令行工具

## fzf — 模糊查找器

`fzf` 是一个通用的命令行模糊查找器，从 stdin 读入行列表，交互式过滤后输出选中行。

```bash
brew install fzf
```

在 `.zshrc` 中加载 shell 集成：

```bash
source "$(brew --prefix)/opt/fzf/shell/completion.zsh"
source "$(brew --prefix)/opt/fzf/shell/key-bindings.zsh"
```

快捷键一览：

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+T` | 模糊搜索文件 |
| `Ctrl+R` | 模糊搜索命令历史 |
| `Alt+C` / `Esc C` | 模糊搜索目录并 cd |

> Mac 上 Alt 键的坑：macOS 终端默认把 Option (⌥) 当作特殊字符输入键而非 Meta 键。解决办法：iTerm2 → Preferences → Profiles → Keys → Option key → 选 `Esc+`；或者直接用 `Esc` 代替 `Alt`。

搭配一个自定义函数 `cdf`——在当前目录树下模糊搜索子目录并跳转：

```bash
cdf() {
  local dir
  dir=$(find . -type d 2>/dev/null | fzf +m) && cd "$dir"
}
```

## lsd — 现代化 ls

`lsd` 是 Rust 重写的 `ls`，带 NERD Font 图标、颜色和树形展示。

```bash
brew install lsd
```

## tldr (tlrc) — 简化命令手册

`tldr` 提供命令的常用示例，比 `man` 短得多。`tlrc` 是它的 Rust 实现（原版 `tldr` 已停止维护）。

```bash
brew install tlrc
```

配置文件在 `~/Library/Application Support/tlrc/config.toml`，添加中文优先：

```toml
[cache]
languages = ["zh"]
```

有中文翻译的页面显示中文，没有的自动降级到英文。

## jq — JSON 处理器

```bash
brew install jq

# 美化输出
cat data.json | jq .

# 取字段
cat data.json | jq '.name'

# 筛选
cat data.json | jq '.[] | select(.age > 25)'

# raw output（脚本中去除引号）
cat data.json | jq -r '.name'
```

## btop — 资源监视器

`btop` 是 `htop` 的现代化替代，纯 C++ 实现，界面更美观。

```bash
brew install btop
```

## fastfetch — 系统信息

`neofetch` 已停更，`fastfetch` 是纯 C 重写的后继，速度更快。

```bash
brew install fastfetch
```

## gh — GitHub CLI

```bash
brew install gh
gh auth login
```

搭配一键上传 zsh 配置到 Gist：

```bash
zshrc-gist() {
  gh gist create ~/.zshrc ~/.zprofile ~/.zshenv(N) --desc "zsh config $(date +%Y-%m-%d)" ${1:+--public}
}

zshrc-gist          # 私密 gist
zshrc-gist public   # 公开 gist
```

# zsh 插件

## zsh-autosuggestions

根据命令历史实时建议补全，以灰色文字显示，按 `→` 或 `Ctrl+F` 接受。

```bash
brew install zsh-autosuggestions
```

## zsh-syntax-highlighting

命令语法高亮：合法命令绿色，不合法红色，字符串黄色。

```bash
brew install zsh-syntax-highlighting
```

## 加载顺序

在 `.zshrc` 末尾的加载顺序很重要——`zsh-syntax-highlighting` 包装了 ZLE（行编辑器），必须放在最后：

```bash
# fzf
source "$(brew --prefix)/opt/fzf/shell/completion.zsh"
source "$(brew --prefix)/opt/fzf/shell/key-bindings.zsh"

# zsh plugins
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

# macOS 应用

## EasyDict — 划词翻译

开源的 macOS 划词翻译词典，支持多种翻译引擎。

```bash
brew install --cask easydict
```

# Python 工具

本机 Python 由 `uv` 管理，跑临时脚本的标准姿势是：

```bash
uv run --with <package> python script.py
```

## mlx-whisper

Apple Silicon GPU 原生的语音识别，基于 MLX 框架，推理速度远快于 CPU 方案。

```bash
pip install mlx-whisper
```

## mineru

开源 PDF 内容提取工具，支持 OCR、表格识别和 Markdown 输出。

```bash
pip install mineru
```

# 尚未完成

| 工具 | 用途 | 状态 |
|------|------|------|
| BasicTeX | 轻量 LaTeX 发行版（~100MB），带 tlmgr | `brew install --cask basictex`（需 sudo 密码） |
| ctex 字体 | fandol, xits 中文字体 | 先装 BasicTeX，再 `sudo tlmgr install fandol xits` |

# 完整的 .zshrc

最终 `.zshrc` 的完整内容和本文总结都已发布在 Gist：[macOS 装机配置](https://gist.github.com/GabC2003/4e1c9e91e1f84d1850643f1859235c5e)。
