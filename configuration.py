import os
import platform
import yaml


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

        self.validate(self.config)

    def validate(self, settings):
        is_init = settings.get('is_init')
        if not is_init:
            # 如果没有初始化，不做参数校验
            return False
        base_model_file = settings.get("base_model_path") or ''
        if is_init and not base_model_file:
            raise ValueError(f"base_model_path is required")
        if is_init and not os.path.exists(base_model_file):
            raise FileNotFoundError(f"base_model_path {base_model_file} ")

        embedding_path = settings.get("embedding_path") or ''
        if is_init and not embedding_path:
            raise ValueError(f"embedding_path is required")
        if is_init and not os.path.exists(embedding_path):
            raise FileNotFoundError(f"embedding_path {embedding_path} not found")
        rerank_path = settings.get("reranker_path") or ''
        if is_init and not rerank_path:
            raise ValueError(f"reranker_path is required")
        if is_init and not os.path.exists(rerank_path):
            raise FileNotFoundError(f"reranker_path {rerank_path} not found ")

        self.default_base_model_path = base_model_file.strip()
        self.default_embedding_path = embedding_path.strip()
        self.default_rerank_path = rerank_path.strip()

        vectordb_name = settings.get("vectordb_name") or 'chromadb'
        self.default_vectordb_name = vectordb_name
        vectordb_path = settings.get("vectordb_path") or ''
        if is_init and not vectordb_path:
            raise ValueError(f"vectordb_path is required ")
        if is_init and not os.path.exists(vectordb_path):
            raise NotADirectoryError(f"vectordb_path {vectordb_path} ")
        vectordb_host = settings.get("vectordb_host", '0.0.0.0')
        if is_init and not vectordb_host:
            raise ValueError(f"vectordb_host is required for index service")

        vectordb_port = settings.get("vectordb_port", '')
        if not (isinstance(vectordb_port, int) or (isinstance(vectordb_port, str) and vectordb_port.isdigit())):
            raise ValueError(f"vectordb_port is required for index service")

        knowledge_base_path = settings.get("knowledge_base_path", '')
        if knowledge_base_path:
            if is_init and not os.path.exists(knowledge_base_path):
                raise NotADirectoryError(f"knowledge_base_path {knowledge_base_path}")

    def set_config(self, base_model_path=None, embedding_path=None, reranker_path=None,
                   knowledge_base_path=None, vectordb_path=None, vectordb_port=None,strategy=None, vectordb_name=None):
        is_save = False
        if base_model_path and base_model_path != self.default_base_model_path:
            self.default_base_model_path = base_model_path.strip()
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
            self.config['is_init'] = True
            with open(self.config_file_path, "w") as f:
                yaml.dump(self.config, f)


config = Configuration("ragq.yml")

OS_NAME = platform.system().lower()
