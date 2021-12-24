---
layout: page
title: projects
permalink: /projects/
---
<ul>
{% for project in site.projects %}
<li><a href="{{ project.url }}">{{ project.title }}</a> - {{ project.description }}</li>
</ul>
{% endfor %}