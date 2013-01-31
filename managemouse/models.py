from django.db import models

class strain(models.Model):
  strainName = models.CharField(max_length=200)

class cage(models.Model):
  cageName = models.CharField(max_length=200)
  isBreeding = models.BooleanField()

class mice(models.Model):
  MALE = 'MA'
  FEMALE = 'FE'
  GENDER_OPTIONS = (
    (MALE, 'Male'),
    (FEMALE, 'Female'),
  )
  gender = models.CharField(max_length=2,
			    choices=GENDER_OPTIONS,
			    default=MALE)
  mlb = models.CharField(max_length=50,
			default=' ')
  name = models.CharField(max_length=50)
  parents = models.CharField(max_length=50)
  genotype = models.CharField(max_length=50)
  genotypeTwo = models.CharField(max_length=50)
  notes = models.CharField(max_length=200)
  cage = models.ForeignKey(cage)
