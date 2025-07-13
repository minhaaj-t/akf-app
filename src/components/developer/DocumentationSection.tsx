import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { mockDocumentation } from "../../data/mockData";
import { Documentation } from "../../types";
import { BookOpen, FileText, User, Calendar, Tag, Search, Download, Eye } from "lucide-react";

export const DocumentationSection: React.FC = () => {
  const { user } = useAuth();
  const [docs] = useState<Documentation[]>(mockDocumentation);
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: <FileText size={16} /> },
    { id: 'user-guide', label: 'User Guide', icon: <BookOpen size={16} /> },
    { id: 'admin-guide', label: 'Admin Guide', icon: <User size={16} /> },
    { id: 'api', label: 'API', icon: <Tag size={16} /> },
    { id: 'deployment', label: 'Deployment', icon: <Download size={16} /> },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: <Eye size={16} /> }
  ];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for basic formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold text-gray-900 mt-5 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-600 ml-4">{line.substring(2)}</li>;
        }
        if (line.startsWith('```')) {
          return <div key={index} className="bg-gray-100 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto">{line.substring(3)}</div>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-600 mb-2">{line}</p>;
      });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user-guide': return 'bg-blue-100 text-blue-800';
      case 'admin-guide': return 'bg-purple-100 text-purple-800';
      case 'api': return 'bg-green-100 text-green-800';
      case 'deployment': return 'bg-orange-100 text-orange-800';
      case 'troubleshooting': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
          <p className="text-sm text-gray-600">System documentation and guides</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Documentation List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div key={doc.id} onClick={() => setSelectedDoc(doc)}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {doc.content.substring(0, 150)}...
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(doc.category)}`}>
                  {doc.category.replace('-', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{doc.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                                 <span className="text-xs bg-gray-100 px-2 py-1 rounded">v{doc.version}</span>
               </div>
             </CardContent>
           </Card>
           </div>
         ))}
       </div>

      {/* No Results */}
      {filteredDocs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documentation found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Documentation Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedDoc.category)}`}>
                      {selectedDoc.category.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">v{selectedDoc.version}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>By {selectedDoc.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Updated {new Date(selectedDoc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => {
                      // In a real app, this would download the documentation
                      alert('Download functionality would be implemented here');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => setSelectedDoc(null)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg">
                  {renderMarkdown(selectedDoc.content)}
                </div>
              </div>

              {/* Related Documentation */}
              <div className="mt-8 border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Related Documentation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docs
                    .filter(doc => doc.id !== selectedDoc.id && doc.category === selectedDoc.category)
                    .slice(0, 4)
                                         .map((doc) => (
                       <div key={doc.id} onClick={() => setSelectedDoc(doc)}>
                         <Card className="cursor-pointer hover:shadow-md transition-shadow">
                           <CardContent className="p-4">
                          <h5 className="font-medium text-gray-900 mb-1">{doc.title}</h5>
                                                     <p className="text-sm text-gray-600 line-clamp-2">
                             {doc.content.substring(0, 100)}...
                           </p>
                         </CardContent>
                       </Card>
                       </div>
                     ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Documentation Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{docs.length}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {docs.filter(doc => doc.isPublished).length}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(docs.map(doc => doc.category)).size}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(docs.map(doc => doc.author)).size}
              </div>
              <div className="text-sm text-gray-600">Authors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 