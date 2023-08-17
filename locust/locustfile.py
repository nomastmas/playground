from locust import task, FastHttpUser
import json
import random
import string

def random_text(prefix=''):
    letters = string.ascii_letters
    result = ''.join(random.choice(letters) for _ in range(8))
    return prefix+result

def random_lang():
    return random.choice(['zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'de-DE', 'es-ES', 'fr-FR', 'it-IT', 'ru-RU', 'vi-VN'])

def random_zone():
    return random.choice(['z_v_r_r_1', 'z_v_r_b_2', 'z_a_b_1', 'z_a_c_1', 'z_a_c_2'])

class VideoUser(FastHttpUser):
    host = "https://loadtest.dev.ganjing.world/v1/cdkapi"

    @task
    def get_one(self, name="01 Getone"):
        cid = random_text()
        cnt_id = random_text()
        req_id = random_text()
        lang = random_lang()
        with self.client.get(url="/getone", params={"cid":cid, "cnt_id":cnt_id, "req_id":req_id, "lang":lang},  name=name, catch_response=True) as r:
            if r.status_code >= 400:
                r.failure("Got 4xx response")
