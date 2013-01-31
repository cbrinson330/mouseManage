# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'mice.foo'
        db.add_column('managemouse_mice', 'foo',
                      self.gf('django.db.models.fields.CharField')(default='bar', max_length=50),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'mice.foo'
        db.delete_column('managemouse_mice', 'foo')


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
            'foo': ('django.db.models.fields.CharField', [], {'default': "'bar'", 'max_length': '50'}),
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