flowchart LR
  %% ===== VPC =====
  subgraph VPC[Custom VPC 10.0.0.0/16]
    direction TB

    %% Internet
    internet[(Internet)]
    IGW[Internet Gateway]
    internet --> IGW

    %% ---------- AZ A ----------
    subgraph AZA[Availability Zone A]
      direction TB

      subgraph PubA[Public Subnet A]
        ALB[(Application Load Balancer)]
        NATa[NAT Gateway A]
      end

      subgraph AppA[Private-App Subnet A]
        EC2A[EC2 (ASG target)]
        SSMa[VPCE: SSM/EC2Msgs/SSMMmsgs]
      end

      subgraph DBA[Private-DB Subnet A]
        DBAstub[(DB Subnet Group A)]
      end

      RTApub[Public RTB\n0.0.0.0/0 -> IGW]
      RTAppA[Private-App RTB A\n0.0.0.0/0 -> NAT A]
      RTDB[Private-DB RTB\n(no default route)]

      IGW -->|default| RTApub
      RTApub --> PubA

      AppA --> RTAppA --> NATa
    end

    %% ---------- AZ B ----------
    subgraph AZB[Availability Zone B]
      direction TB

      subgraph PubB[Public Subnet B]
        NATb[NAT Gateway B]
      end

      subgraph AppB[Private-App Subnet B]
        EC2B[EC2 (ASG target)]
        SSMb[VPCE: SSM/EC2Msgs/SSMMmsgs]
      end

      subgraph DBB[Private-DB Subnet B]
        DBBstub[(DB Subnet Group B)]
      end

      RTAppB[Private-App RTB B\n0.0.0.0/0 -> NAT B]

      RTApub --> PubB
      AppB --> RTAppB --> NATb
    end

    %% ALB spans public subnets in both AZs
    PubA --- ALB --- PubB
    internet --> ALB

    %% Target group routing to private EC2
    ALB -->|TG: HTTP/HTTPS\n(ALB SG -> App SG)| EC2A
    ALB -->|TG: HTTP/HTTPS\n(ALB SG -> App SG)| EC2B

    %% Single RDS Multi-AZ using DB Subnet Group across AZs
    subgraph RDSgrp[DB Subnet Group (A+B)]
      RDS[(RDS Multi-AZ\nPrimary/Standby\nWriter endpoint)]
    end
    DBAstub --- RDSgrp --- DBBstub

    %% App -> DB (SG rule)
    EC2A -->|5432\n(App SG -> DB SG)| RDS
    EC2B -->|5432\n(App SG -> DB SG)| RDS

    %% S3 Gateway endpoint for private subnets
    S3GW[Gateway VPCE: S3]
    RTAppA --- S3GW
    RTAppB --- S3GW
    RTDB  --- S3GW

    %% HTTPS & logs
    ACM[[ACM Cert]]
    ALB -. uses .- ACM
    LOGS[(S3 Logs Bucket)]
    ALB -. access logs .-> LOGS
  end

  %% Legend (optional)
  classDef faint fill:#f7f7f7,stroke:#ccc,color:#333;
