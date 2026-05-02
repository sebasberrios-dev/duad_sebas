import { useSession } from "../../context/SessionContext";
import { Exercise, User } from "../../types/interfaces";
import { Days, DraftRoutine } from "../../types/types";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import RegisterExercise from "../../features/routine-exercise/RegisterExercise";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { FormSection } from "../../components/Form/FormSection";
import DaysField from "../../features/routine/fields/DaysField";
import RoutineNameField from "../../features/routine/fields/RoutineNameField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterRoutineFormData,
  registerRoutineSchema,
} from "../../features/routine/schema/routineSchema";
import { useNavigate } from "react-router";
import { printRoutine, printWeeklyLoad } from "../../utils/console";

export default function RegisterRoutine() {
  const [draft, setDraft] = useState<DraftRoutine>({});
  const [draftComments, setDraftComments] = useState<
    Partial<Record<Days, string>>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Days | null>(null);
  const { currentUser, updateCurrentUser } = useSession();
  const { control, handleSubmit } = useForm<RegisterRoutineFormData>({
    resolver: zodResolver(registerRoutineSchema),
  });

  function openModal(day: Days) {
    setSelectedDay(day);
    setIsModalOpen(true);
  }

  function handleExerciseAdded(exercise: Exercise) {
    if (!selectedDay) return;
    setDraft((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] ?? []), exercise],
    }));
    setIsModalOpen(false);
  }

  function handleSaveRoutine(data: RegisterRoutineFormData) {
    if (!currentUser) return;

    const workouts = Object.entries(draft).map(([day, exercises]) => ({
      day: [day as Days],
      exercises: exercises,
      comment: draftComments[day as Days],
    }));

    const updatedUser = {
      ...currentUser,
      routine: {
        id: Date.now(),
        routineName: data.routineName,
        routineStartDate: new Date().toISOString(),
        workouts,
      },
    };

    updateCurrentUser(updatedUser);
    setDraft({});
    setDraftComments({});
  }

  function handleSeeRoutine() {
    const user = currentUser as User;
    const routine = user.routine;

    printRoutine(routine, user);
    printWeeklyLoad(routine, user);
  }

  return (
    <FormSection>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedDay && (
          <RegisterExercise day={selectedDay} onSuccess={handleExerciseAdded} />
        )}
      </Modal>
      <FormContainer onSubmit={handleSubmit(handleSaveRoutine)}>
        <FormTitle>Registrar rutina</FormTitle>
        <RoutineNameField control={control} />
        <DaysField
          draft={draft}
          draftComments={draftComments}
          onClick={openModal}
          onCommentChange={(day, value) =>
            setDraftComments((prev) => ({ ...prev, [day]: value }))
          }
        />

        <Button type="submit">Guardar rutina</Button>

        <Button type="button" onClick={handleSeeRoutine}>
          Ver mi rutina
        </Button>
      </FormContainer>
    </FormSection>
  );
}
