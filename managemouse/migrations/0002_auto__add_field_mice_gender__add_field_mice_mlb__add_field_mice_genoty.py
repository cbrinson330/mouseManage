# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'mice.gender'
        db.add_column('managemouse_mice', 'gender',
                      self.gf('django.db.models.fields.CharField')(default='MA', max_length=2),
                      keep_default=False)

        # Adding field 'mice.mlb'
        db.add_column('managemouse_mice', 'mlb',
                      self.gf('django.db.models.fields.CharField')(default=' ', max_length=50),
                      keep_default=False)

        # Adding field 'mice.genotypeTwo'
        db.add_column('managemouse_mice', 'genotypeTwo',
                      self.gf('django.db.models.fields.CharField')(default='foo', max_length=50),
                      keep_default=False)

        # Adding field 'mice.notes'
        db.add_column('managemouse_mice', 'notes',
                      self.gf('django.db.models.fields.CharField')(default=' ', max_length=200),
                      keep_default=False)


        # Changing field 'mice.parents'
        db.alter_column('managemouse_mice', 'parents', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'mice.genotype'
        db.alter_column('managemouse_mice', 'genotype', self.gf('django.db.models.fields.CharField')(max_length=50))

        # Changing field 'mice.name'
        db.alter_column('managemouse_mice', 'name', self.gf('django.db.models.fields.CharField')(max_length=50))

    def backwards(self, orm):
        # Deleting field 'mice.gender'
        db.delete_column('managemouse_mice', 'gender')

        # Deleting field 'mice.mlb'
        db.delete_column('managemouse_mice', 'mlb')

        # Deleting field 'mice.genotypeTwo'
        db.delete_column('managemouse_mice', 'genotypeTwo')

        # Deleting field 'mice.notes'
        db.delete_column('managemouse_mice', 'notes')


        # Changing field 'mice.parents'
        db.alter_column('managemouse_mice', 'parents', self.gf('django.db.models.fields.CharField')(max_length=200))

        # Changing field 'mice.genotype'
        db.alter_column('managemouse_mice', 'genotype', self.gf('django.db.models.fields.CharField')(max_length=200))

        # Changing field 'mice.name'
        db.alter_column('managemouse_mice', 'name', self.gf('django.db.models.fields.CharField')(max_length=200))

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
        }
    }

    complete_apps = ['managemouse']