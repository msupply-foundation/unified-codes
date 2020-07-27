## VS Code

### Debug Config Sample for REST API (unified-codes/api/.vscode/launch.json)
<pre>
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Attach to debug",
			"port": 5998,
			"request": "attach",
			"skipFiles": [
				"<node_internals>/**"
			],
			"type": "pwa-node"
		}
	]
}
</pre>
