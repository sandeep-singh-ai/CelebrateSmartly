
interface EditorRightPanelProps {
  className?: string;
}

export const EditorRightPanel = ({ className }: EditorRightPanelProps) => {
  return (
    <div className={`w-80 border-l bg-card overflow-auto panel__right ${className || ''}`}>
      <div className="p-4 space-y-4">
        <div className="layers-container border rounded p-2 h-64 overflow-auto">
          <h3 className="font-medium mb-2 text-sm">Layers</h3>
        </div>
        
        <div className="styles-container border rounded p-2 min-h-64 overflow-auto">
          <h3 className="font-medium mb-2 text-sm">Styles</h3>
        </div>
        
        <div className="traits-container border rounded p-2 min-h-32 overflow-auto">
          <h3 className="font-medium mb-2 text-sm">Settings</h3>
        </div>
      </div>
    </div>
  );
};
