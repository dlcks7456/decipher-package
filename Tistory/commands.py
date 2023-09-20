import sublime, sublime_plugin, re, operator
from itertools import product
import html

class spanBold(sublime_plugin.TextCommand):
    def run (self, edit):
        try:
            sels = self.view.sel()[0]
            textr = self.view.substr(sels)
            set_text = '<span class=\"mypost-bold\">{}</span>'.format(textr)
            self.view.replace(edit,sels, set_text)
            
        except Exception as e:
            print (e)

class spanGreenBold(sublime_plugin.TextCommand):
    def run (self, edit):
        try:
            sels = self.view.sel()[0]
            textr = self.view.substr(sels)
            set_text = '<span class=\"mypost-gpt-bold\">{}</span>'.format(textr)
            self.view.replace(edit,sels, set_text)
            
        except Exception as e:
            print (e) 

class entityCommand(sublime_plugin.TextCommand):
        def run (self, edit):
            try:
                sels = self.view.sel()[0]
                textr = self.view.substr(sels)
                textr = html.escape(textr)
                textr = textr.replace('[', '〔')
                textr = textr.replace(']', '〕')
                self.view.replace(edit,sels, textr)
                
            except Exception as e:
                print (e) 