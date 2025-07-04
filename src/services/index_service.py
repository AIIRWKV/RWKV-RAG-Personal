import time
from multiprocessing import Lock


from src.services.abc import AbstractServiceWorker
from src.vectordb import VectorDBError
from src.vectordb import INIT_VECTORDB_COLLECTION_NAME
from src.vectordb import get_vectordb_manager

    
class ServiceWorker(AbstractServiceWorker):

    lock = Lock()

    def init_with_config(self, config:dict):
        # 向量数据库相关配置
        self.vectordb_name = config.get("vectordb_name")
        self.vectordb_port = config.get("vectordb_port")
        self.vectordb_host =config.get("vectordb_host", )
        self.vectordb_path = config.get("vectordb_path")

        # 控制管理器只作为客户端相关操作，不做服务端相关操作（比如初始化数据，启动向量数据库服务等）
        self.just_need_client = config.get("just_need_client", False)

        self.vectordb_manager = None  # 管理器
        self.init_once()


    def init_vectordb_db(self):
        """
        Init the vectordb
        """
        if self.lock.acquire(False):
            try:
                manager = self.vectordb_manager
                if not manager.has_collection(INIT_VECTORDB_COLLECTION_NAME):
                    manager.create_collection(INIT_VECTORDB_COLLECTION_NAME)
                    print(f"{self.vectordb_name} collection {INIT_VECTORDB_COLLECTION_NAME} is created")
                    print(f"{self.vectordb_name} collection {INIT_VECTORDB_COLLECTION_NAME} is ready")
            finally:
                self.lock.release()

    def init_once(self):
        Manager = get_vectordb_manager(self.vectordb_name)
        if not Manager:
            raise VectorDBError(f'暂时不支持向量数据库类型:{self.vectordb_name}')
        self.vectordb_manager = Manager(self.vectordb_path, self.vectordb_port, self.vectordb_host)
        if not self.just_need_client:
            # 启动本地向量数据库服务
            self.vectordb_manager.run()
            time.sleep(5)
            self.init_vectordb_db()

    def index_texts(self, cmd: dict):
        """
        添加数据到向量数据库
        :param cmd:
        :return:
        """
        return self.vectordb_manager.add(cmd)

    def show_collections(self, cmd: dict):
       return self.vectordb_manager.show_collections(cmd)

    def create_collection(self, cmd: dict):
        collection_name = cmd['collection_name']
        return self.vectordb_manager.create_collection(collection_name)

    def delete_collection(self, cmd: dict):
        collection_name = cmd['collection_name']
        return self.vectordb_manager.delete_collection(collection_name)

    def has_collection(self, cmd: dict):
        collection_name = cmd['collection_name']
        return self.vectordb_manager.has_collection(collection_name)

    def search_nearby(self, cmd: dict):
       return self.vectordb_manager.search_nearby(cmd)

    def delete(self, cmd: dict):
        return self.vectordb_manager.delete(cmd)

    def get(self, cmd:dict):
        return self.vectordb_manager.get(cmd)

    def update(self, cmd: dict):
        return self.vectordb_manager.update(cmd)