# coding=utf-8
"""
装饰器
"""

from functools import wraps
import time

def retry(max_retries=3, delay=0, exceptions=(Exception,)):
    """
    函数执行失败时自动重试的装饰器
    :param max_retries: 最大重试次数（默认3次）
    :param delay: 每次重试间隔秒数（默认1秒）
    :param exceptions: 触发重试的异常类型（默认捕获所有异常）
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_retries:  # 达到最大重试次数后抛出异常
                        return
                    print(f"⚠️ 异常: {e}，{delay}秒后重试 [{attempt}/{max_retries}]")
                    if delay > 0:
                        time.sleep(delay)
        return wrapper
    return decorator
