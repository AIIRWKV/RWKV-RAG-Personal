#coding=utf-8
import os

from configuration import config as project_config

knowledge_base_path = project_config.config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认分块后数据存储位置
default_log_base_dir = os.path.join(knowledge_base_path, 'logs') # 默认分割数据时日志存储位置

if not os.path.exists(default_knowledge_base_dir):
    os.makedirs(default_knowledge_base_dir)

if not os.path.exists(default_log_base_dir):
    os.makedirs(default_log_base_dir)