#coding=utf-8
import os

from src.services.files_service import FileStatusManager
from src.services.index_service import ServiceWorker as IndexServiceWorker
from src.services.llm_service import ServiceWorker as LLMServiceWorker, LLMService
from configuration import config as project_config, SQLITE_DB_PATH


files_status_manager = FileStatusManager(SQLITE_DB_PATH, project_config.default_base_model_path)
index_service_worker = IndexServiceWorker(project_config.config)
#llm_service_worker = LLMServiceWorker(project_config.config)

knowledge_base_path = project_config.config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认分块后数据存储位置
default_log_base_dir = os.path.join(knowledge_base_path, 'logs') # 默认分割数据时日志存储位置

if not os.path.exists(default_knowledge_base_dir):
    os.makedirs(default_knowledge_base_dir)

if not os.path.exists(default_log_base_dir):
    os.makedirs(default_log_base_dir)