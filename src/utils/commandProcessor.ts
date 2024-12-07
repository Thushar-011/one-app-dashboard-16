import { Widget } from "@/types/widget";
import { toast } from "sonner";

export interface WidgetData {
  alarms?: Array<{ id: string; time: string; enabled: boolean }>;
  tasks?: Array<{ id: string; text: string; completed: boolean }>;
  reminders?: Array<{ id: string; text: string; date: string; completed: boolean }>;
  notes?: Array<{ id: string; text: string; createdAt: string }>;
  categories?: Array<{ id: string; name: string; color: string }>;
  expenses?: Array<{ id: string; amount: number; description: string; categoryId: string; date: string }>;
}

export const processCommand = async (
  text: string,
  widgets: Widget[],
  updateWidget: (id: string, updates: Partial<Widget>) => void,
  addWidget: (type: string, position?: { x: number; y: number }) => void
) => {
  const lowerText = text.toLowerCase();
  console.log("Processing command:", lowerText);

  // Alarm commands
  if (lowerText.includes("alarm")) {
    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3]?.toLowerCase();

      // Convert to 24-hour format
      if (period === "pm" && hours < 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;

      const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      
      // Find existing alarm widget
      let alarmWidget = widgets.find(w => w.type === "alarm");
      
      if (!alarmWidget) {
        // Create new alarm widget with initial data
        const widgetId = `alarm-${Date.now()}`;
        addWidget("alarm", { x: 0, y: 0 });
        
        // Create the alarm data
        const newAlarm = {
          id: Date.now().toString(),
          time,
          enabled: true,
        };

        // Update the widget with initial data
        setTimeout(() => {
          updateWidget(widgetId, {
            data: { 
              alarms: [newAlarm]
            }
          });
        }, 0);

        console.log("Created new alarm widget with ID:", widgetId);
      } else {
        // Update existing widget
        const currentAlarms = alarmWidget.data?.alarms || [];
        const newAlarm = {
          id: Date.now().toString(),
          time,
          enabled: true,
        };

        updateWidget(alarmWidget.id, {
          data: { 
            alarms: [...currentAlarms, newAlarm]
          }
        });

        console.log("Updated existing alarm widget:", alarmWidget.id);
      }

      console.log("Alarm set for:", time);
      toast.success(`Alarm set for ${time}`);
    } else {
      toast.error("Could not understand the time format");
    }
    return;
  }

  else if (lowerText.includes("task") || lowerText.includes("todo")) {
    const taskText = text.replace(/add (a )?task|todo/i, "").trim();
    if (taskText) {
      let todoWidget = widgets.find(w => w.type === "todo");
      if (!todoWidget) {
        addWidget("todo", { x: 0, y: 0 });
        todoWidget = widgets[widgets.length - 1];
      }

      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
      };

      const updatedTasks = [...(todoWidget?.data?.tasks || []), newTask];
      updateWidget(todoWidget.id, {
        data: { tasks: updatedTasks }
      });

      toast.success("Task added successfully");
    }
  }

  // Reminder commands
  else if (lowerText.includes("reminder")) {
    const reminderText = text.replace(/set (a )?reminder/i, "").trim();
    if (reminderText) {
      let reminderWidget = widgets.find(w => w.type === "reminder");
      if (!reminderWidget) {
        addWidget("reminder", { x: 0, y: 0 });
        reminderWidget = widgets[widgets.length - 1];
      }

      const newReminder = {
        id: Date.now().toString(),
        text: reminderText,
        date: new Date().toISOString(),
        completed: false,
      };

      const updatedReminders = [...(reminderWidget?.data?.reminders || []), newReminder];
      updateWidget(reminderWidget.id, {
        data: { reminders: updatedReminders }
      });

      toast.success("Reminder added successfully");
    }
  }

  // Note commands
  else if (lowerText.includes("note")) {
    const noteText = text.replace(/start taking notes|add (a )?note/i, "").trim();
    if (noteText) {
      let noteWidget = widgets.find(w => w.type === "note");
      if (!noteWidget) {
        addWidget("note", { x: 0, y: 0 });
        noteWidget = widgets[widgets.length - 1];
      }

      const newNote = {
        id: Date.now().toString(),
        text: noteText,
        createdAt: new Date().toISOString(),
      };

      const updatedNotes = [...(noteWidget?.data?.notes || []), newNote];
      updateWidget(noteWidget.id, {
        data: { notes: updatedNotes }
      });

      toast.success("Note added successfully");
    }
  }

  // Expense commands
  else if (lowerText.includes("expense")) {
    const match = lowerText.match(/expense of (\d+) under (.+)/i);
    if (match) {
      const amount = parseInt(match[1]);
      const category = match[2].trim();

      let expenseWidget = widgets.find(w => w.type === "expense");
      if (!expenseWidget) {
        addWidget("expense", { x: 0, y: 0 });
        expenseWidget = widgets[widgets.length - 1];
      }

      let categoryId = expenseWidget?.data?.categories?.find(
        (c: any) => c.name.toLowerCase() === category.toLowerCase()
      )?.id;

      if (!categoryId) {
        categoryId = Date.now().toString();
        const newCategory = {
          id: categoryId,
          name: category,
          color: "#" + Math.floor(Math.random()*16777215).toString(16),
        };
        expenseWidget.data.categories = [...(expenseWidget?.data?.categories || []), newCategory];
      }

      const newExpense = {
        id: Date.now().toString(),
        amount,
        description: `Voice command: ${amount} under ${category}`,
        categoryId,
        date: new Date().toISOString(),
      };

      const updatedExpenses = [...(expenseWidget?.data?.expenses || []), newExpense];
      updateWidget(expenseWidget.id, {
        data: {
          categories: expenseWidget.data.categories,
          expenses: updatedExpenses,
        }
      });

      toast.success(`Expense of ${amount} added under ${category}`);
    }
  }
};