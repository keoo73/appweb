# -*- coding: utf-8 -*-
"""
Created on Thu Nov 11 20:44:31 2021

@author: USER
"""

from flask import Flask
from twilio.rest import Client
import os
from flask import request
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)

@app.route("/")
def inicio():
    test = os.environ.get("Test")
    return test

@app.route("/sms")
def sms():
    
    try:
        # Find your Account SID and Auth Token at twilio.com/console
        # and set the environment variables. See http://twil.io/secure
        account_sid = os.environ['TWILIO_ACCOUNT_SID']
        auth_token = os.environ['TWILIO_AUTH_TOKEN']
        client = Client(account_sid, auth_token)
        
        contenido = request.args.get("mensaje")
        destino = request.args.get("telefono")
        
        
        message = client.messages \
                        .create(
                             body= contenido,
                             from_='+12792054351',
                             to= '+57'+ destino
                         )
        
        print(message.sid)    
        return "Enviado correctamente"
    except Exception as e:
        return "Error enviando el mensaje"

@app.route("/envio-correo")
def email():
    
    destino = request.args.get("correo_destino")
    asunto = request.args.get("asunto")
    mensaje = request.args.get("contenido")
    
    message = Mail(
    from_email='eduarstiven2001@gmail.com',
    to_emails= destino,
    subject= asunto,
    html_content= mensaje)
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        
        return "Correo electrónico enviado"
    except Exception as e:
        print(e.message)
        return "Error enviando correo"


if __name__ == '__main__':
    app.run()