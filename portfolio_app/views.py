from django.shortcuts import render
from django.views.generic import ListView, View
from django.http import JsonResponse
from .models import Project, Inquiry, Profile, Skill, TimelineItem

class HomeView(ListView):
    model = Project
    template_name = 'portfolio/index.html'
    context_object_name = 'projects'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile'] = Profile.objects.first()
        context['skills'] = Skill.objects.order_by('category', 'order')
        context['timeline'] = TimelineItem.objects.order_by('item_type', 'order')
        return context

class InquiryView(View):
    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        if name and email and message:
            Inquiry.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
            return JsonResponse({
                'status': 'success',
                'message': 'Sua mensagem foi enviada com sucesso! Entrarei em contato em breve.'
            }, status=201)
        
        return JsonResponse({
            'status': 'error',
            'message': 'Por favor, preencha todos os campos obrigatórios.'
        }, status=400)
