import os

from .abc import AbstractServiceWorker, PipeLine
from .files_service import SqliteDB, FileStatusManager
from .index_service import ServiceWorker as IndexServiceWorker
from .llm_service import ServiceWorker as LLMServiceWorker, LLMService
from configuration import config as project_config

_sqlite_db_path = os.path.join(project_config.config.get('knowledge_base_path',), 'files_services.db')

sqlite_db = SqliteDB(_sqlite_db_path)
files_status_manager = FileStatusManager(_sqlite_db_path, project_config.default_base_model_path)
index_service_worker = IndexServiceWorker(project_config.config)
llm_service_worker = LLMServiceWorker(project_config.config)



