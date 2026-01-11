'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Certificate } from '@/components/courses';
import { useProgress } from '@/hooks';
import { useProfile } from '@/hooks/useProfile';
import type { CourseWithInstructor } from '@/lib/loaders/courses';
import { ArrowLeft, Award, User, AlertCircle } from 'lucide-react';

interface CertificadoPageClientProps {
  course: CourseWithInstructor;
}

export function CertificadoPageClient({ course }: CertificadoPageClientProps) {
  const { progress, generateCertificate, isLoaded } = useProgress(course.id);
  const { profile } = useProfile();
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  // Verifica se já tem certificado gerado
  useEffect(() => {
    if (isLoaded && progress.certificateGenerated && progress.userName) {
      setUserName(progress.userName);
      setIsGenerated(true);
    } else if (isLoaded && progress.quizCompleted && progress.quizResult?.passed) {
      // Se tem nome no perfil, usa automaticamente
      if (profile?.name) {
        setUserName(profile.name);
        generateCertificate(profile.name);
        setIsGenerated(true);
      } else {
        // Caso contrário, pede o nome
        setShowNameModal(true);
      }
    }
  }, [isLoaded, progress, profile?.name, generateCertificate]);

  const handleGenerateCertificate = () => {
    if (!userName.trim()) return;
    
    generateCertificate(userName.trim());
    setShowNameModal(false);
    setIsGenerated(true);
  };

  // Verifica se pode acessar o certificado
  if (isLoaded && (!progress.quizCompleted || !progress.quizResult?.passed)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link 
          href={`/cursos/${course.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao curso
        </Link>

        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-warning/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
            <CardTitle>Certificado Bloqueado</CardTitle>
            <CardDescription>
              Para gerar seu certificado, você precisa primeiro completar o quiz com aprovação.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href={`/cursos/${course.id}/quiz`}>
                Fazer Quiz
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const instructorName = course.instructorData?.name ?? 'PCursos';
  const completionDate = progress.completedAt ?? new Date().toISOString();

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <Link 
        href={`/cursos/${course.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar ao curso
      </Link>

      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Seu Certificado</h1>
        <p className="text-sm text-muted-foreground">
          Parabéns por concluir o curso {course.title}!
        </p>
      </div>

      {isGenerated ? (
        <Certificate
          courseName={course.title}
          studentName={userName}
          instructorName={instructorName}
          completionDate={completionDate}
        />
      ) : (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              Carregando seu certificado...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal para inserir nome */}
      <Dialog open={showNameModal} onOpenChange={setShowNameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Gerar Certificado
            </DialogTitle>
            <DialogDescription>
              Digite seu nome completo para gerar o certificado de conclusão do curso.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateCertificate()}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleGenerateCertificate}
              disabled={!userName.trim()}
            >
              Gerar Certificado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
