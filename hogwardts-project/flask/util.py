from datetime import datetime, timedelta
import jwt


def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, seconds=5),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        # pass 'SECRET_KEY' stored in proprety file .env file
        return jwt.encode(
            payload,
            "4gh6hcg34",
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, "4gh6hcg34",  algorithms=['HS256'], verify=False)
        return payload['sub']
    except Exception as e:
        raise e
    # except jwt.ExpiredSignatureError:
    #     return 'Signature expired. Please log in again.'
    # except jwt.InvalidTokenError:
    #     return 'Invalid token. Please log in again.'



