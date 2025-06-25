
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

export const PrintSection = () => {
  const printItems = [
    {
      id: 1,
      title: "Dana Assignment Schedule",
      description: "Monthly schedule of all your dana assignments with temple details and timing information",
      fileName: "dana-schedule.pdf"
    },
    {
      id: 2,
      title: "Temple Contact Directory", 
      description: "Complete list of temple contacts, addresses and phone numbers for your assigned temples",
      fileName: "temple-contacts.pdf"
    },
    {
      id: 3,
      title: "Dana Guidelines",
      description: "Complete guide on dana preparation, timing, and requirements for different types of offerings",
      fileName: "dana-guidelines.pdf"
    }
  ];

  const handleDownload = (fileName: string, title: string) => {
    console.log(`Downloading ${fileName} - ${title}`);
    // Here you would implement actual download functionality
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Print & Download</h2>
        <p className="text-gray-600 mt-1">Download important documents and schedules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {printItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg text-orange-800">
                    {item.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{item.description}</p>
              <Button 
                onClick={() => handleDownload(item.fileName, item.title)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
