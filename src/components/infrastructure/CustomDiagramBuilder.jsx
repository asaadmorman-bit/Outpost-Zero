import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, Trash2, Save, Eye, Download, 
  Server, Database, Cloud, Network, Shield, Zap,
  Box, Code, ArrowRight, Settings
} from 'lucide-react';

export default function CustomDiagramBuilder() {
  const [diagramName, setDiagramName] = useState('My Architecture');
  const [nodes, setNodes] = useState([
    { id: 1, name: 'API Server', type: 'server', x: 200, y: 100 },
    { id: 2, name: 'Database', type: 'database', x: 200, y: 250 }
  ]);
  const [connections, setConnections] = useState([
    { from: 1, to: 2, label: 'Queries' }
  ]);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = [
    { type: 'server', icon: Server, color: 'from-blue-600 to-blue-700', label: 'Server' },
    { type: 'database', icon: Database, color: 'from-purple-600 to-purple-700', label: 'Database' },
    { type: 'cloud', icon: Cloud, color: 'from-cyan-600 to-cyan-700', label: 'Cloud' },
    { type: 'network', icon: Network, color: 'from-green-600 to-green-700', label: 'Network' },
    { type: 'security', icon: Shield, color: 'from-red-600 to-red-700', label: 'Security' },
    { type: 'service', icon: Zap, color: 'from-orange-600 to-orange-700', label: 'Service' },
    { type: 'storage', icon: Box, color: 'from-yellow-600 to-yellow-700', label: 'Storage' },
    { type: 'api', icon: Code, color: 'from-pink-600 to-pink-700', label: 'API' }
  ];

  const addNode = (type) => {
    const newNode = {
      id: Date.now(),
      name: `New ${type}`,
      type: type,
      x: 300,
      y: 200 + (nodes.length * 50)
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
  };

  const updateNodeName = (nodeId, newName) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, name: newName } : n));
  };

  const addConnection = () => {
    if (nodes.length < 2) {
      alert('Add at least 2 nodes first');
      return;
    }
    const from = nodes[0].id;
    const to = nodes[1].id;
    setConnections([...connections, { from, to, label: 'Connection' }]);
  };

  const exportDiagram = () => {
    const exportData = {
      name: diagramName,
      nodes: nodes,
      connections: connections,
      created_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramName.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateMermaid = () => {
    let mermaid = 'graph TB\n';
    
    nodes.forEach(node => {
      const nodeTypeInfo = nodeTypes.find(t => t.type === node.type);
      mermaid += `    ${node.id}[${node.name}]\n`;
    });
    
    connections.forEach((conn, idx) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      if (fromNode && toNode) {
        mermaid += `    ${conn.from} -->|${conn.label}| ${conn.to}\n`;
      }
    });
    
    nodes.forEach(node => {
      const nodeTypeInfo = nodeTypes.find(t => t.type === node.type);
      if (nodeTypeInfo) {
        const color = nodeTypeInfo.color.includes('blue') ? '#1e3a8a' :
                     nodeTypeInfo.color.includes('purple') ? '#6b21a8' :
                     nodeTypeInfo.color.includes('green') ? '#15803d' :
                     nodeTypeInfo.color.includes('red') ? '#991b1b' : '#374151';
        mermaid += `    style ${node.id} fill:${color},stroke:#fff,stroke-width:2px,color:#fff\n`;
      }
    });

    const blob = new Blob([mermaid], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-diagram.mmd';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-purple-500/50 bg-purple-500/10">
        <Settings className="h-5 w-5 text-purple-400" />
        <AlertDescription className="text-purple-200">
          <strong>Custom Diagram Builder:</strong> Create your own network and architecture diagrams with drag-and-drop components. Export to multiple formats.
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Diagram Editor</CardTitle>
            <Input
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              className="w-64 bg-gray-900 border-gray-700 text-white"
              placeholder="Diagram name"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Node Type Palette */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Add Components</h4>
            <div className="grid grid-cols-4 gap-2">
              {nodeTypes.map((nodeType) => (
                <Button
                  key={nodeType.type}
                  onClick={() => addNode(nodeType.type)}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700"
                  size="sm"
                >
                  <nodeType.icon className="w-4 h-4 mr-2" />
                  {nodeType.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Visual Canvas */}
          <div className="relative h-96 bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden">
            <div className="absolute inset-0 p-4">
              {/* Render Connections */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                return (
                  <div key={idx} className="absolute">
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeDasharray="4"
                      />
                    </svg>
                  </div>
                );
              })}

              {/* Render Nodes */}
              {nodes.map((node) => {
                const nodeTypeInfo = nodeTypes.find(t => t.type === node.type);
                const Icon = nodeTypeInfo?.icon || Box;

                return (
                  <div
                    key={node.id}
                    style={{ left: node.x, top: node.y }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move ${
                      selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className={`w-32 p-3 rounded-lg bg-gradient-to-br ${nodeTypeInfo?.color || 'from-gray-600 to-gray-700'} border border-gray-700 shadow-lg`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-white" />
                        <Badge className="bg-white/20 text-white text-xs">
                          {nodeTypeInfo?.label}
                        </Badge>
                      </div>
                      <div className="text-white text-xs font-medium truncate">
                        {node.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Add components to start building your diagram</p>
                </div>
              </div>
            )}
          </div>

          {/* Node Editor */}
          {selectedNode && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-sm">Edit Component</h4>
                  <Button
                    onClick={() => deleteNode(selectedNode.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-300 hover:bg-red-600/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Component Name</label>
                    <Input
                      value={selectedNode.name}
                      onChange={(e) => updateNodeName(selectedNode.id, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Type</label>
                      <Badge className="bg-blue-600/20 text-blue-300">
                        {nodeTypes.find(t => t.type === selectedNode.type)?.label}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">ID</label>
                      <span className="text-gray-400 text-sm">{selectedNode.id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={addConnection}
              variant="outline"
              className="border-gray-600 flex-1"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Add Connection
            </Button>
            <Button
              onClick={exportDiagram}
              variant="outline"
              className="border-blue-600 text-blue-300 hover:bg-blue-600/10 flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={generateMermaid}
              className="bg-purple-600 hover:bg-purple-700 flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Mermaid
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{nodes.length}</div>
              <div className="text-xs text-gray-400">Components</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{connections.length}</div>
              <div className="text-xs text-gray-400">Connections</div>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">
                {new Set(nodes.map(n => n.type)).size}
              </div>
              <div className="text-xs text-gray-400">Types</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}