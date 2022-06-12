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
            "TA": "稅務",
            "AC": "會計",
            "FI": "金融",
            "CR": "刑法",
            "CI": "民法",
            "CO": "公司法"
        }[field_code]