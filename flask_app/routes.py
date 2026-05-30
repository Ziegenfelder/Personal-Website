# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from . import socketio
db = database()


#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

def getUser():
	return db.reversibleEncrypt('decrypt', session['email']) if 'email' in session else 'Unknown'

def getRole():
	return db.query(f"SELECT role FROM users WHERE email = '{getUser()}'")[0]['role']

@app.route('/login')
def login():
	return render_template('login.html')

@app.route('/logout')
def logout():
	session.pop('email', default=None)
	return redirect('/home')

@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
	form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
	if(db.authenticate(form_fields['email'], form_fields['password']) == {'success': 1}):
		session['email'] = db.reversibleEncrypt('encrypt', form_fields['email']) 
		return json.dumps({'success':1})
	return json.dumps({'success':0})



#######################################################################################
# CHATROOM RELATED
#######################################################################################
@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html', user=getUser())

@socketio.on('joined', namespace='/chat')
def joined(message):
    join_room('main')
    if(getRole() == 'owner'):
        emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
    else:
        emit('status', {'msg': getUser() + ' has entered the room.'}, room='main')


@socketio.on('message', namespace='/chat')
def message(message):
	if(getRole() == 'owner'):
		emit('status', {'msg': message['msg'], 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
	else:
		emit('status', {'msg': message['msg']}, room='main')

@socketio.on('left', namespace='/chat')
def left(message):
	leave_room('main')
	if(getRole() == 'owner'):
		emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
	else:
		emit('status', {'msg': getUser() + ' has left the room.'}, room='main')
#######################################################################################
# OTHER
#######################################################################################
@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	print(db.query('SELECT * FROM users'))
	x = random.choice(['My favorite video game is League of Legends.','I have two cats.','I like to slalom water ski.'])
	return render_template('home.html', user=getUser(), fun_fact = x)

@app.route('/projects')
def projects():
	return render_template('projects.html')

@app.route('/resume')
def resume():
	resume_data = db.getResumeData()
	return render_template('resume.html', resume_data = resume_data)

@app.route('/piano')
def piano():
	return render_template('piano.html')

@app.route('/processfeedback', methods = ['POST'])
def processfeedback():
	feedback = request.form
	db.insertRows("feedback", ["comment_id", "name", "email", "comment"], [["NULL", f'"{feedback["fname"]}"', f'"{feedback["femail"]}"', f'"{feedback["fcomment"]}"']])
	return render_template('processfeedback.html', feedback_data = db.query("SELECT * FROM feedback"))

@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r
