# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
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
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('parents', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('genotype', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('cage', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['managemouse.cage'])),
        ))
        db.send_create_signal('managemouse', ['mice'])


    def backwards(self, orm):
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
            'genotype': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'parents': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['managemouse']