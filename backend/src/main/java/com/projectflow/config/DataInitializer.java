package com.projectflow.config;

import com.projectflow.entity.*;
import com.projectflow.repository.*;
import com.projectflow.service.ProjectService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectService projectService;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           TaskRepository taskRepository,
                           NotificationRepository notificationRepository,
                           SystemSettingRepository systemSettingRepository,
                           PasswordEncoder passwordEncoder,
                           ProjectService projectService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectService = projectService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // 1. Seed Users
        User admin = userRepository.save(new User("Rahul Sharma (Admin)", "admin@projectflow.com", passwordEncoder.encode("admin123"), Role.ADMIN, UserStatus.ACTIVE));
        User manager = userRepository.save(new User("Priya Patel (PM)", "manager@projectflow.com", passwordEncoder.encode("manager123"), Role.PROJECT_MANAGER, UserStatus.ACTIVE));
        User dev = userRepository.save(new User("Amit Kumar (Dev)", "developer@projectflow.com", passwordEncoder.encode("dev123"), Role.TEAM_MEMBER, UserStatus.ACTIVE));
        User designer = userRepository.save(new User("Sneha Desai (UI/UX)", "designer@projectflow.com", passwordEncoder.encode("design123"), Role.TEAM_MEMBER, UserStatus.ACTIVE));
        User tester = userRepository.save(new User("Vikram Singh (QA)", "tester@projectflow.com", passwordEncoder.encode("test123"), Role.TEAM_MEMBER, UserStatus.ACTIVE));

        // 2. Seed Projects
        Project p1 = new Project(
                "UPI Payment Gateway App",
                "Next-generation payment app supporting seamless UPI transfers, Razorpay integration, and real-time merchant settlements.",
                LocalDate.now().minusDays(30),
                LocalDate.now().plusDays(45),
                ProjectStatus.ACTIVE,
                manager
        );
        p1.setTeamMembers(new HashSet<>(Arrays.asList(dev, designer, tester)));
        p1 = projectRepository.save(p1);

        Project p2 = new Project(
                "Rural Banking Application",
                "Aadhaar-enabled micro-banking application for regional rural banks with regional language support.",
                LocalDate.now().minusDays(15),
                LocalDate.now().plusDays(60),
                ProjectStatus.ACTIVE,
                manager
        );
        p2.setTeamMembers(new HashSet<>(Arrays.asList(dev, designer)));
        p2 = projectRepository.save(p2);

        Project p3 = new Project(
                "IIT Campus Management System",
                "Enterprise ERP for student enrollment, CGPA grading, timetable scheduling, and mess fee payment portals.",
                LocalDate.now().minusDays(60),
                LocalDate.now().minusDays(5),
                ProjectStatus.COMPLETED,
                manager
        );
        p3.setTeamMembers(new HashSet<>(Arrays.asList(dev, tester)));
        p3 = projectRepository.save(p3);

        Project p4 = new Project(
                "IRCTC AI Chatbot",
                "LLM-powered intelligent assistant for automated Indian Railways ticket booking and PNR status routing.",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(90),
                ProjectStatus.PLANNING,
                manager
        );
        p4.setTeamMembers(new HashSet<>(List.of(dev)));
        p4 = projectRepository.save(p4);

        // 3. Seed Tasks
        // Project 1 Tasks
        taskRepository.save(new Task("Design UPI PIN Flow UI", "Create responsive Figma mockups for 4-digit and 6-digit UPI PIN workflow.", p1, designer, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(25), LocalDate.now().minusDays(20)));
        taskRepository.save(new Task("Implement Razorpay SDK", "Integrate Razorpay API endpoints for merchant transactions and webhooks.", p1, dev, TaskPriority.URGENT, TaskStatus.IN_PROGRESS, LocalDate.now().minusDays(15), LocalDate.now().plusDays(5)));
        taskRepository.save(new Task("Automated E2E UPI Tests", "Write Cypress/Playwright regression tests for NPCI mock payment processing.", p1, tester, TaskPriority.MEDIUM, TaskStatus.TODO, LocalDate.now().minusDays(5), LocalDate.now().plusDays(12)));
        taskRepository.save(new Task("Merchant Database Indexing", "Optimize PostgreSQL indexes for high-frequency QR code queries.", p1, dev, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(20), LocalDate.now().minusDays(10)));

        // Project 2 Tasks
        taskRepository.save(new Task("Aadhaar eKYC Integration", "Integrate UIDAI endpoints for seamless biometric onboarding.", p2, dev, TaskPriority.URGENT, TaskStatus.IN_PROGRESS, LocalDate.now().minusDays(10), LocalDate.now().plusDays(10)));
        taskRepository.save(new Task("Regional Language Support", "Establish Hindi and Marathi localized components in the frontend.", p2, designer, TaskPriority.LOW, TaskStatus.COMPLETED, LocalDate.now().minusDays(12), LocalDate.now().minusDays(2)));
        taskRepository.save(new Task("RBI Guidelines Audit", "Conduct vulnerability scan and ensure compliance with RBI data localization.", p2, dev, TaskPriority.HIGH, TaskStatus.REVIEW, LocalDate.now().minusDays(8), LocalDate.now().plusDays(2)));
        taskRepository.save(new Task("SMS Alert Gateway", "Setup TRAI compliant SMS gateway for real-time transaction alerts.", p2, dev, TaskPriority.MEDIUM, TaskStatus.TODO, LocalDate.now().minusDays(2), LocalDate.now().plusDays(20)));

        // Project 3 Tasks (Completed Project)
        taskRepository.save(new Task("JEE Main Rank Integration", "Build student signup form with JEE Main rank verification.", p3, dev, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(55), LocalDate.now().minusDays(45)));
        taskRepository.save(new Task("CGPA Gradebook Export", "Allow professors to export PDF and Excel grade reports.", p3, dev, TaskPriority.MEDIUM, TaskStatus.COMPLETED, LocalDate.now().minusDays(40), LocalDate.now().minusDays(25)));
        taskRepository.save(new Task("Load Testing Counseling Surge", "Perform JMeter load testing for 50,000 concurrent students during counseling.", p3, tester, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(20), LocalDate.now().minusDays(10)));

        // Project 4 Tasks (Planning)
        taskRepository.save(new Task("Train LLM on IRCTC Data", "Define structured prompt templates for train schedules and availability.", p4, dev, TaskPriority.HIGH, TaskStatus.TODO, LocalDate.now().plusDays(5), LocalDate.now().plusDays(18)));

        // 4. Update Project Progress Metrics
        projectService.updateProjectProgress(p1.getId());
        projectService.updateProjectProgress(p2.getId());
        projectService.updateProjectProgress(p3.getId());
        projectService.updateProjectProgress(p4.getId());

        // 5. Seed System Settings
        systemSettingRepository.save(new SystemSetting("APP_NAME", "ProjectFlow India", "Application main title displayed across portal"));
        systemSettingRepository.save(new SystemSetting("DEFAULT_PROJECT_STATUS", "PLANNING", "Default status for newly initialized projects"));
        systemSettingRepository.save(new SystemSetting("DEFAULT_TASK_STATUS", "TODO", "Default status assigned to newly created tasks"));
        systemSettingRepository.save(new SystemSetting("EMAIL_NOTIFICATIONS_ENABLED", "true", "Enable system email notification alerts"));
        systemSettingRepository.save(new SystemSetting("ALLOW_USER_REGISTRATION", "true", "Allow self-registration for team members"));

        // 6. Seed Notifications
        notificationRepository.save(new Notification(admin, "System Initialization", "ProjectFlow India system initialized successfully with sample data.", "SYSTEM"));
        notificationRepository.save(new Notification(manager, "Project Status Update", "UPI Payment Gateway App is currently 50% completed.", "PROJECT"));
        notificationRepository.save(new Notification(dev, "New Task Assignment", "You have been assigned to 'Implement Razorpay SDK'.", "TASK"));
        notificationRepository.save(new Notification(designer, "Design Review Requested", "UPI PIN flow UI is ready for manager approval.", "TASK"));
    }
}
