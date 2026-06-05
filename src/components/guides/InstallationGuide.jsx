import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Download } from 'lucide-react';

const CodeBlock = ({ children }) => (
  <pre className="bg-gray-900/70 rounded-md p-4 my-4 overflow-x-auto">
    <code className="text-sm text-white font-mono">{children}</code>
  </pre>
);

const LinuxGuide = () => (
  <div>
    <h3 className="text-xl font-semibold text-white mt-4 mb-2">Linux (Debian/Ubuntu)</h3>
    <p className="text-gray-400 mb-2">Use the following commands to install the CyberShield agent on Debian-based systems.</p>
    <CodeBlock>
{`# 1. Download the agent package
wget https://cdn.cybershield.com/agents/latest/cybershield-agent_amd64.deb

# 2. Install the package
sudo dpkg -i cybershield-agent_amd64.deb

# 3. Configure the agent with your tenant ID
sudo /usr/bin/cybershield-agent --configure --tenant-id YOUR_TENANT_ID

# 4. Start and enable the service
sudo systemctl start cybershield-agent
sudo systemctl enable cybershield-agent`}
    </CodeBlock>

    <h3 className="text-xl font-semibold text-white mt-6 mb-2">Linux (RHEL/CentOS/Fedora)</h3>
    <p className="text-gray-400 mb-2">Use the following commands to install the CyberShield agent on RPM-based systems.</p>
    <CodeBlock>
{`# 1. Download the agent package
wget https://cdn.cybershield.com/agents/latest/cybershield-agent.x86_64.rpm

# 2. Install the package
sudo rpm -ivh cybershield-agent.x86_64.rpm

# 3. Configure the agent with your tenant ID
sudo /usr/bin/cybershield-agent --configure --tenant-id YOUR_TENANT_ID

# 4. Start and enable the service
sudo systemctl start cybershield-agent
sudo systemctl enable cybershield-agent`}
    </CodeBlock>
  </div>
);

const WindowsGuide = () => (
  <div>
    <h3 className="text-xl font-semibold text-white mt-4 mb-2">Windows Server & Desktop</h3>
    <p className="text-gray-400 mb-2">Download the MSI installer and run the following commands in an Administrator PowerShell.</p>
    <div className="my-4">
        <a href="https://cdn.cybershield.com/agents/latest/CyberShieldAgent.msi" 
           className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4"/>
            Download Windows Agent (MSI)
        </a>
    </div>
    <CodeBlock>
{`# Run the installer via command line for silent installation
msiexec /i CyberShieldAgent.msi /quiet TENANT_ID="YOUR_TENANT_ID"

# Or, run the MSI graphically and enter the Tenant ID when prompted.

# The service will start automatically after installation.`}
    </CodeBlock>
  </div>
);

const MacOsGuide = () => (
  <div>
    <h3 className="text-xl font-semibold text-white mt-4 mb-2">macOS</h3>
    <p className="text-gray-400 mb-2">Download the PKG installer and run it. You will be prompted to enter your Tenant ID during installation.</p>
    <div className="my-4">
        <a href="https://cdn.cybershield.com/agents/latest/CyberShieldAgent.pkg" 
           className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4"/>
            Download macOS Agent (PKG)
        </a>
    </div>
    <p className="text-gray-400 mb-2">Alternatively, use the command line:</p>
    <CodeBlock>
{`# 1. Download the agent package
curl -O https://cdn.cybershield.com/agents/latest/CyberShieldAgent.pkg

# 2. Run the installer
sudo installer -pkg CyberShieldAgent.pkg -target /

# 3. Configure the agent with your tenant ID
sudo /usr/local/bin/cybershield-agent --configure --tenant-id YOUR_TENANT_ID

# 4. Load the service
sudo launchctl load /Library/LaunchDaemons/com.cybershield.agent.plist`}
    </CodeBlock>
  </div>
);


export default function InstallationGuide() {
  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-400" />
          Agent Installation Guides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="linux" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="linux">Linux</TabsTrigger>
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="macos">macOS</TabsTrigger>
          </TabsList>
          <TabsContent value="linux"><LinuxGuide /></TabsContent>
          <TabsContent value="windows"><WindowsGuide /></TabsContent>
          <TabsContent value="macos"><MacOsGuide /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}