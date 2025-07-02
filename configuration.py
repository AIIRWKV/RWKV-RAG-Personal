import os
import platform
import yaml
from enum import Enum
from queue import Queue


class Configuration:
    def __init__(self, config_file):
        if not os.path.exists(config_file):
            raise FileNotFoundError(f"Config file {config_file} not found")
        with open(config_file) as f:
            try:
                self.config = yaml.safe_load(f)
            except yaml.YAMLError as exc:
                raise ValueError(f"Invalid config file {config_file}")
        self.config_file_path = config_file
        self.default_base_model_path = ''  # 默认基座模型路径
        self.default_embedding_path = ''  # 默认bgem3路径
        self.default_rerank_path = ''  # 默认rerank路径
        self.default_state_path = '' # 默认state文件
        self.default_vectordb_name = 'chromadb'
        self.base_model_size = 0
        self.default_rwkv_version = 'x070'

        self.validate(self.config)

    def validate(self, settings):
        rwkv_version = settings.get("rwkv_version") or self.default_rwkv_version
        if rwkv_version not in ['x070', 'x060']:
            raise ValueError(f"rwkv_version must be 'x060' or 'x070'")
        base_model_file = settings.get("base_model_path") or ''
        base_model_file = base_model_file.strip()
        if not base_model_file:
            raise ValueError(f"base_model_path is required")
        if not os.path.exists(base_model_file):
            raise FileNotFoundError(f"base_model_path {base_model_file} ")

        embedding_path = settings.get("embedding_path") or ''
        embedding_path = embedding_path.strip()
        if not embedding_path:
            raise ValueError(f"embedding_path is required")
        if not os.path.exists(embedding_path):
            raise FileNotFoundError(f"embedding_path {embedding_path} not found")
        rerank_path = settings.get("reranker_path") or ''
        rerank_path = rerank_path.strip()
        if not rerank_path:
            raise ValueError(f"reranker_path is required")
        if not os.path.exists(rerank_path):
            raise FileNotFoundError(f"reranker_path {rerank_path} not found ")

        self.default_rwkv_version = rwkv_version
        self.default_base_model_path = base_model_file
        self.base_model_size = os.path.getsize(base_model_file)
        self.default_embedding_path = embedding_path
        self.default_rerank_path = rerank_path

        vectordb_name = settings.get("vectordb_name") or 'chromadb'
        self.default_vectordb_name = vectordb_name
        vectordb_path = settings.get("vectordb_path") or ''
        if not vectordb_path:
            raise ValueError(f"vectordb_path is required ")
        if not os.path.exists(vectordb_path):
            raise NotADirectoryError(f"vectordb_path {vectordb_path} ")
        vectordb_host = settings.get("vectordb_host", '0.0.0.0')
        if not vectordb_host:
            raise ValueError(f"vectordb_host is required for index service")

        vectordb_port = settings.get("vectordb_port", '')
        if not (isinstance(vectordb_port, int) or (isinstance(vectordb_port, str) and vectordb_port.isdigit())):
            raise ValueError(f"vectordb_port is required for index service")

        knowledge_base_path = settings.get("knowledge_base_path", '')
        if knowledge_base_path:
            if not os.path.exists(knowledge_base_path):
                raise NotADirectoryError(f"knowledge_base_path {knowledge_base_path}")

    def set_config(self, base_model_path=None, embedding_path=None, reranker_path=None,
                   knowledge_base_path=None, vectordb_path=None, vectordb_port=None,strategy=None, vectordb_name=None):
        is_save = False
        if base_model_path and base_model_path != self.default_base_model_path:
            self.default_base_model_path = base_model_path
            self.base_model_size = os.path.getsize(base_model_path)
            self.config['base_model_path'] = base_model_path
            is_save = True
        if embedding_path and embedding_path != self.default_embedding_path:
            self.default_embedding_path = embedding_path
            self.config['embedding_path'] = embedding_path
            is_save = True
        if reranker_path and reranker_path != self.default_rerank_path:
            self.default_rerank_path = reranker_path
            self.config['reranker_path'] = reranker_path
        if knowledge_base_path and knowledge_base_path != self.config.get("knowledge_base_path"):
            self.config['knowledge_base_path'] = knowledge_base_path
            is_save = True
        if vectordb_name and vectordb_name != self.config.get("vectordb_name"):
            self.config['vectordb_name'] = vectordb_name
            self.default_vectordb_name = vectordb_name
            is_save = True
        if vectordb_path and vectordb_path != self.config.get("vectordb_path"):
            self.config['vectordb_path'] = vectordb_path
            is_save = True
        if vectordb_port and vectordb_port != self.config.get("vectordb_port"):
            self.config['vectordb_port'] = vectordb_port
            is_save = True
        if strategy and strategy != self.config.get("strategy"):
            self.config['strategy'] = strategy
            is_save = True
        if is_save:
            with open(self.config_file_path, "w") as f:
                yaml.dump(self.config, f)

    def check_cpu_env(self):
        """
        check cpu memory
        :return:
        """
        import psutil
        memory = psutil.virtual_memory()
        total_memory = memory.total
        available_memory = memory.available
        if available_memory < self.base_model_size * 1.1:
            return (f'Total Memory: {total_memory} bytes, Available Memory: {available_memory} bytes, '
                    f'base model size: {self.base_model_size} bytes, not enough memory to load the model.')
        return 'ok'

    def check_gpu_env(self):
        import torch
        has_cuda = torch.cuda.is_available()
        if not has_cuda:
            return 'CUDA is not available.'
        cuda_version = torch.version.cuda
        cuda_version_list = [int(i) for i in cuda_version.split('.')]
        if cuda_version_list < [12, 1]:
            return f'CUDA version:{cuda_version} is not supported, please upgrade to 12.1 or higher.'

        # TODO 目前系统默认使用设备0，后续做成可配置的
        gpu_memory_total = torch.cuda.get_device_properties(0).total_memory
        if gpu_memory_total < self.base_model_size * 1.25:
            return f'GPU total Memory:{gpu_memory_total}, base model size:{self.base_model_size}, not enough memory to load the model.'
        return 'ok'



config = Configuration("ragq.yml")

OS_NAME = platform.system().lower()

SERVER_PORT = 8080

SQLITE_DB_PATH = os.path.join(config.config.get('knowledge_base_path',), 'files_services.db')


class AsyncTaskType(Enum):
    LOADER_DATA_BY_FILE = 1  #  数据切片
    DELETE_DATA_BY_FILE = 2  # 删除向量数据量数据，并删除文件信息
    DELETE_DATA_BY_FILE_FROM_VB = 3  # 删除向量数据量数据，但不删除文件信息

MESSAGE_QUEUE = Queue()