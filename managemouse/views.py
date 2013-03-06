from django.http import HttpResponse, HttpResponseRedirect, HttpRequest
from django.utils import simplejson
from django.template.loader import get_template
from django.template import Context
from django.shortcuts import render_to_response
from managemouse.models import cage, mice, strain
import datetime


def init(request, strainSelected):
  s = strain.objects.all()
  strainToPull = strain.objects.filter(strainName = strainSelected)
  cages = cage.objects.filter(strain = strainToPull)
  m = mice.objects.all()
  return render_to_response('cages-template.html', {'cages': cages,
							  'mice': m,
							  'strain':strainSelected,
							  'strainsAll':s})

def gridView(request):	
  s = strain.objects.all()
  return render_to_response('cages-template.html', {'strainsAll':s})

def dashboard(request):
  return render_to_response('dashboard.html')
  
def tableView(request):
  m = mice.objects.all()
  return render_to_response('tableView.html', {'mice':m})

### Start API ###
def responseEncode(code, content):
  if code == 200:
    response = {'code':'200',
	      	'message': "You're the man now dog",
		'content': content}

  elif code == 201:
    response = {'code':'201',
	      	 'message': "Thingy created",
		'content': content}

  elif code == 400:
    response = {'code':'400',
	      	 'message': "your request is bad and you should feel bad",
		'content':content}
  
  elif code == 401:
    response = {'code':'401',
	      	'message': "Just what do you think you're doing dave (unauthorized)",
		'content': content}

  elif code == 404:
    response = {'code':'404',
	      	 'message': "that Page doesn't exist...trust me I looked",
		'content': content}

  elif code == 420:
    response = {'code':'420',
	      	 'message': "might sound cool 420 Ahhh sweet Brah... NOT COOL! your cage has mice in it.",
		'content': content}

  elif code == 500:
    response = {'code':'500',
	      	 'message': "cuss got cussed up",
		'content': content}

  
  return response
### Start strain api ###
def restStrainsGet(request):
  flag = 200
  content = {}
  try:
    strains = strain.objects.all()
  except:
    flat = 500
    
  if flag != 500:
    count = 1;
    for s in strains:
      cageInfo = {'strainId': s.id,
		  'strainName': s.strainName}
      content[count] = strainInfo
      count += 1

  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')

def restStrainPost(request):
  flag = 500
  content = {'foo':'bar'}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    flag = 201

    try:
      strainToMake = strain(strainName=rawInput['name'])
    except:
      flag = 402

    if flag != 400:
      try:
	strainToMake.save()
      except:
	flag = 404
      
  else:
    flag = 406
  
  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')



def restStrainGet(request):
  flag = 500
  hascages = 1
  content = {'':''}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    try:
      cleanId = int(rawInput['id'])
    except:
      flag = 400

    if flag != 400:
      try:
	strainToGet = strain.objects.get(id=cleanId)
      except:
	flag = 400

      try:
	cagesInStrain = cages.objects.get(strain=strainToGet)
      except:
	hasMice = 0
    
    if flag != 400:
      content = {'id':strainToGet.id,
		 'name': strainToGet.strainName,
		 'hascages':hasCages}
      flag = 200
    else:
      flag = 400
  else:
    flag = 400
  
  
  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')

def restStrainDelete(request):
  flag = 500
  content = {'':''}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    flag = 200
    try:
      cleanId = int(rawInput['id'])
    except:
      flag = 400
    
    if flag == 200:
      content = {'test':'one'}
      try:
	StrainToGet = strain.objects.get(id = cleanId)
      except:
	flag = 400

    if flag == 200:
      content = {'test':'Two'}
      try:
	StrainToGet.delete()
      except:
	flag = 400
    
  else:
    flag = 400
    content = {'test':'Three'}
    
  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')


### Start cage api ###
def restCagePut(request):
  flag = 500
  content = {'':''}
  
  ### Check that the perameters are GET perameters

  if request.method == 'GET':
    rawInput = request.GET.copy()
    cleanId = int(rawInput['id'])
    ### Check that the id passed is a number before trying to query the DB
    try:
      cageToUpdate = cage.objects.get(id = cleanId)
    except:
      flag = 400

    if flag != 400:
      flag = 200
      #to do check is breeding input is bool
      cageToUpdate.isBreeding = rawInput['isBreeding']
      cageToUpdate.cageName = rawInput['name']
      
      try:
	cageToUpdate.save()
      except:
	flag = 400
      
    else:
      flag = 400
  else:
    flag = 400

  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')


def restCagesGet(request):
  flag = 200
  content = {}
  try:
    cages = cage.objects.all()
  except:
    flat = 500
    
  if flag != 500:
    count = 1;
    for c in cages:
      cageInfo = {'cageId': c.id,
		  'cageName': c.cageName}
      content[count] = cageInfo
      count += 1

  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')

def restCageGet(request):
  flag = 500
  hasmice = 1
  content = {'':''}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    try:
      cleanId = int(rawInput['id'])
    except:
      flag = 400

    if flag != 400:
      try:
	cageToGet = cage.objects.get(id=cleanId)
      except:
	flag = 400

      try:
	miceIncage = mice.objects.get(cage=cageToGet)
      except:
	hasMice = 0
    
    if flag != 400:
      content = {'id':cageToGet.id,
		 'isBreeding':cageToGet.isBreeding, 
		 'name': cageToGet.cageName,
		 'hasmice':hasMice}
      flag = 200
    else:
      flag = 400
  else:
    flag = 400
  
  
  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')
 
 
def restCageDelete(request):
  flag = 500
  content = {'':''}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    flag = 200
    try:
      cleanId = int(rawInput['id'])
    except:
      flag = 400
    
    if flag == 200:
      try:
	cageToGet = cage.objects.get(id = cleanId)
      except:
	flag = 400

    if flag == 200:
      try:
	cageToGet.delete()
      except:
	flag = 400
    
  else:
    flag = 400
  
  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')


def restCagePost(request):
  flag = 500
  content = {'foo':'bar'}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    flag = 201

    #check that strain exists
    try:
      strainToAdd = strain.objects.get(strainName=rawInput['strain'])
    except:
      flag = 400

    #set IsBreeding to int
    try:
      cleanIsBreeding = int(rawInput['isBreeding'])
    except:
      flag = 400

    try:
      cageToMake = cage(cageName=rawInput['name'],isBreeding=cleanIsBreeding, strain=strainToAdd)
    except:
      flag = 400

    if flag != 400:
      try:
	cageToMake.save()
      except:
	flag = 400
      
    if flag != 400:
      content = {'foo':'bar'}
      cageToGet = cage.objects.get(cageName=rawInput['name'])
      content = {'cageId': cageToGet.id,
		   'cageName':cageToGet.cageName,
		   'isBreeding' : cageToGet.isBreeding}
     
  else:
    flag = 400
  
  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')
### end cage api ### 

### start mouse api ###
def restMouseGet(request):
  flag = 500
  content = {'':''}
  
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    cleanid = int(rawInput['id'])
    content = {'id':cleanid}

    try:
      mouseToGet = mice.objects.get(id=cleanid)
    except:
      flag = 400
    
    if flag != 400:
      flag = 200
      cageID = mouseToGet.cage.id
      content = {'id':mouseToGet.id,
		 'name': mouseToGet.name,
		 'mlb': mouseToGet.mlb,
		 'gender':mouseToGet.gender,
		 'notes' :mouseToGet.notes,
		 'cage': cageID,
		 'genotype': mouseToGet.genotype,
		 'genotypeTwo' : mouseToGet.genotypeTwo,
		 'parents':mouseToGet.parents
		}

  else:
    flag = 400

  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')

def restMouseDelete(request):
  flag = 500
  content = {'':''}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    flag = 200
    rawInput = request.GET.copy()
    cleanid = int(rawInput['id'])
    try:
      mouse = mice.objects.get(id = cleanid)
    except:
      flag = 400
    
    if flag != 400:
      try:
	mouse.delete()
      except:
	flag = 401 
	      
  else:
    flag = 400

  response = responseEncode(flag,content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')

def restMousePost(request): 
  flag = 500
  content = {'foo':'bar'}
  
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    rawInput = request.GET.copy()
    mouseCageClean = int(rawInput['cage'])
    content = {'':''}

    try:
      mouseParentCage = cage.objects.get(id=mouseCageClean)
    except:
      flag = 400
    
    if flag != 400:
      flag = 201
      mouseToMake = mice(name=rawInput['name'],
        		 parents = rawInput['parents'],
        		 genotype = rawInput['genotype'],
        		 genotypeTwo = rawInput['genotypeTwo'],
        		 mlb = rawInput['mlb'],
        		 gender = rawInput['gender'],
        		 notes = rawInput['notes'],
        		 cage = mouseParentCage)
      
      try:
        mouseToMake.save()
      except:
        flag = 400
      
      if flag != 400:
	mouseMade = mice.objects.get(name=rawInput['name']);
	content = {'mouseId':mouseMade.id,
		   'cageId' :mouseMade.cage.id,
		   'name' :mouseMade.name}
  else:
    flag = 400
  
  response = responseEncode(flag,content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')

def restMousePut(request): 
  flag = 500
  content = {'':''}
  ### Check that the perameters are GET perameters
  if request.method == 'GET':
    flag = 200
    rawInput = request.GET.copy()
    cleanMouseId = int(rawInput['id'])

    # check that the mouse they want to update exists
    try:
      mouseToUpdate = mice.objects.get(id=cleanMouseId)
    except:
      flag = 400
 
    # check that the cage they may want to move the mouse to exists
    if 'cageId' in rawInput and flag != 400:
      cleanCageId = int(rawInput['cageId'])
      try:
	cageToUpdate = cage.objects.get(id=cleanCageId)
      except:
	flag = 400
    
      if flag != 400:
	mouseToUpdate.cage = cageToUpdate
    
    if flag != 400:
      
      if 'name' in rawInput:
	mouseToUpdate.name = rawInput['name']

      if 'parents' in rawInput:
	mouseToUpdate.parents = rawInput['parents']

      if 'genotype' in rawInput:
	mouseToUpdate.genotype = rawInput['genotype']
      
      if 'genotypeTwo' in rawInput:
	mouseToUpdate.genotypeTwo = rawInput['genotypeTwo']
      
      if 'gender' in rawInput:
	mouseToUpdate.gender = rawInput['gender']
      
      if 'mlb' in rawInput:
	mouseToUpdate.mlb = rawInput['mlb']
      
      if 'notes' in rawInput:
	mouseToUpdate.notes = rawInput['notes']

    try:
      mouseToUpdate.save()
    except:
      flag = 400
      
  else:
    flag = 400

  response = responseEncode(flag, content)
  json = simplejson.dumps(response)
  return HttpResponse(json, mimetype='application/json')
