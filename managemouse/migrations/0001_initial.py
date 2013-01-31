# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'strain'
        db.create_table('managemouse_strain', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('strainName', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal('managemouse', ['strain'])

        # Adding model 'cage'
        db.create_table('managemouse_cage', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cageName', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('isBreeding', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('managemouse', ['cage'])

        # Adding model 'mice'
        db.create_table('managemouse_mice', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('gender', self.gf('django.db.models.fields.CharField')(default='MA', max_length=2)),
            ('mlb', self.gf('django.db.models.fields.CharField')(default=' ', max_length=50)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('parents', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('genotype', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('genotypeTwo', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('notes', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('cage', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['managemouse.cage'])),
        ))
        db.send_create_signal('managemouse', ['mice'])


    def backwards(self, orm):
        # Deleting model 'strain'
        db.delete_table('managemouse_strain')

        # Deleting model 'cage'
        db.delete_table('managemouse_cage')

        # Deleting model 'mice'
        db.delete_table('managemouse_mice')


    models = {
        'managemouse.cage': {
            'Meta': {'object_name': 'cage'},
            'cageName': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isBreeding': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        'managemouse.mice': {
            'Meta': {'object_name': 'mice'},
            'cage': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['managemouse.cage']"}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'MA'", 'max_length': '2'}),
            'genotype': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'genotypeTwo': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mlb': ('django.db.models.fields.CharField', [], {'default': "' '", 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'notes': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'parents': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'managemouse.strain': {
            'Meta': {'object_name': 'strain'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'strainName': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['managemouse']