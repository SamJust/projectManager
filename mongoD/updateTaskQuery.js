db.projects.update(
	{name: 'project1', 'tasks.id':2},
	{ $set: { "tasks.$.worker" : 'test' }}
);