import os

from .abc import AbstractServiceWorker, PipeLine
from .files_service import FileStatusManager
from .index_service import ServiceWorker as IndexServiceWorker
from .llm_service import ServiceWorker as LLMServiceWorker, LLMService
from configuration import config as project_config, SQLITE_DB_PATH


files_status_manager = FileStatusManager(SQLITE_DB_PATH, project_config.default_base_model_path)
index_service_worker = IndexServiceWorker(project_config.config)
#llm_service_worker = LLMServiceWorker(project_config.config)



