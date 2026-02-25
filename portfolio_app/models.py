from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=500)
    long_description = models.TextField()  # Use CKEditor or similar in actual implementation for RichText
    thumbnail = models.ImageField(upload_to='projects/')
    github_link = models.URLField(blank=True, null=True)
    live_link = models.URLField(blank=True, null=True)
    technologies = models.CharField(max_length=500, help_text="Comma separated list of technologies")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

class Inquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Inquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"From {self.name} - {self.subject}"

class Profile(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='profile/', blank=True, null=True)
    bio_title = models.CharField(max_length=200, help_text="Ex: Desenvolvedor Fullstack & Designer UI/UX")
    bio_description = models.TextField(help_text="Uma descrição breve para a seção Hero")
    about_me = models.TextField(help_text="Descrição completa sobre você")
    experiences = models.TextField(help_text="O que você já fez/mexeu")
    interests = models.TextField(help_text="No que tem interesse em trabalhar")
    currently_developing = models.CharField(max_length=255, help_text="O que está desenvolvendo agora")
    
    # Sociais
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField()
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"

    def __str__(self):
        return self.name

class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('mobile', 'Mobile'),
        ('embedded', 'Sistemas Embarcados'),
        ('tools', 'Ferramentas & Hardware'),
    ]

    name = models.CharField(max_length=50)
    icon_class = models.CharField(max_length=50, help_text="Classe FontAwesome. Ex: fab fa-python")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(default=80, help_text="Porcentagem de 0 a 100")
    order = models.IntegerField(default=0, help_text="Ordem de exibição")

    class Meta:
        ordering = ['category', 'order', 'name']
        verbose_name = "Habilidade"
        verbose_name_plural = "Habilidades"

    def __str__(self):
        return self.name

class TimelineItem(models.Model):
    TYPE_CHOICES = [
        ('work', 'Experiência Profissional'),
        ('education', 'Formação Acadêmica'),
    ]

    title = models.CharField(max_length=100, help_text="Ex: Desenvolvedor Junior ou Ciência da Computação")
    organization = models.CharField(max_length=100, help_text="Empresa ou Instituição")
    location = models.CharField(max_length=100, blank=True, null=True)
    period = models.CharField(max_length=50, help_text="Ex: Jan 2023 - Presente")
    description = models.TextField()
    item_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='work')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['item_type', 'order', '-id']
        verbose_name = "Item da Linha do Tempo"
        verbose_name_plural = "Itens da Linha do Tempo"

    def __str__(self):
        return f"{self.title} @ {self.organization}"
