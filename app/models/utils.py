from re import match


class Utils():
    def __init__(self):
        pass

    @staticmethod
    def convert_gender(gender):
        return {
            "man": "男性",
            "woman": "女性"
        }[gender]

    @staticmethod
    def convert_membership(membership):
        return {
            "member": "一般顧問",
            "consultant": "專業顧問"
        }[membership]

    @staticmethod
    def convert_field_name(field_code):
        return {
            "ta": "稅務",
            "ac": "會計",
            "fi": "金融",
            "cr": "刑法",
            "ci": "民法",
            "co": "公司法"
        }[field_code]