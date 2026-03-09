import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import { useState } from "react";
import { Card } from "./Card";

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRuleCreated: (rule: any) => void;
}

type TriggerType = "agents_says" | "contains" | "mentions_keywords" | "amount_threshold" | "missing_tag" | "time_based";

type Severity = "low" | "medium" | "high";

interface RuleFormData {
  name: string;
  triggerType: TriggerType;
  conditionValue: string;
  severity: Severity;
  sendNotification: boolean;
}

export default function CreateRuleModal({ isOpen, onClose, onRuleCreated }: CreateRuleModalProps) {
  const [formData, setFormData] = useState<RuleFormData>({
    name: "",
    triggerType: "contains",
    conditionValue: "",
    severity: "medium",
    sendNotification: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerTypeOptions = [
    { key: "agents_says", label: "Agent Says" },
    { key: "contains", label: "Contains" },
    { key: "mentions_keywords", label: "Mentions Keywords" },
    { key: "amount_threshold", label: "Amount Threshold" },
    { key: "missing_tag", label: "Missing Tag" },
    { key: "time_based", label: "Time Based" },
  ];

  const severityOptions = [
    { key: "low", label: "Low" },
    { key: "medium", label: "Medium" },
    { key: "high", label: "High" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create rule');
      }

      const newRule = await response.json();
      onRuleCreated(newRule.rule || newRule);
      setFormData({
        name: "",
        triggerType: "contains",
        conditionValue: "",
        severity: "medium",
        sendNotification: false,
      });
      onClose();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Failed to create rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonClassNames = { label: 'font-semibold' }
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Create New Rule</h2>
            <p className="text-sm text-gray-500">Define conditions and actions for automated risk detection</p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Rule Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Rule Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., High-Value Refund Alert"
                  required
                  variant="bordered"
                />
              </div>

              {/* IF Condition */}
              <Card className="p-4">
                <h3>IF (Condition)</h3>

                <div className="grid gap-4">
                  <Select
                    labelPlacement="outside-top"
                    label='Trigger Type'
                    classNames={commonClassNames}
                    selectedKeys={[formData.triggerType]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as TriggerType;
                      if (selected) {
                        setFormData({ ...formData, triggerType: selected });
                      }
                    }}
                    variant="bordered"
                  >
                    {triggerTypeOptions.map((option) => (
                      <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    variant="bordered"
                    value={formData.conditionValue}
                    onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                    placeholder='e.g.,refund, $100, policy exception'
                    required
                    labelPlacement="outside-top"
                    label='Condition Value'
                    classNames={commonClassNames}
                  />
                </div>
              </Card>

              {/* THEN Action */}
              <Card className="p-4">
                <h3 className="font-semibold">THEN (Action)</h3>

                <div className="">
                  <Select
                    selectedKeys={[formData.severity]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as Severity;
                      if (selected) {
                        setFormData({ ...formData, severity: selected });
                      }
                    }}
                    classNames={commonClassNames}
                    variant="bordered"
                    labelPlacement="outside-top"
                    label='Severity Flag'
                  >
                    {severityOptions.map((option) => (
                      <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                  </Select>

                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      isSelected={formData.sendNotification}
                      onValueChange={(checked) => setFormData({ ...formData, sendNotification: checked })}
                      classNames={{ base: 'flex-row-reverse max-w-full w-full justify-between' }}
                      size="sm"
                    >
                      <div>
                        <p className="font-medium">Send Notification</p>
                        <p className="text-xs text-gray-500">Alert managers when rule triggers</p>
                      </div>
                    </Switch>
                  </div>
                </div>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Create Rule
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
